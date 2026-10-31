import re

import discord
from discord import Activity, CustomActivity, Game, Spotify, Streaming

# ------------------ #

ActivityTypes = Activity | Game | CustomActivity | Streaming | Spotify

valid_types = [
    discord.ActivityType.playing,
    discord.ActivityType.streaming,
    discord.ActivityType.listening,
    discord.ActivityType.watching,
    discord.ActivityType.competing,
    discord.ActivityType.custom,
]

# ------------------ #


def get_activity_and_mood(member_activities: tuple[ActivityTypes, ...]):
    try:
        activity_to_be_returned, mood, main_activity = {}, None, None

        activities = [
            activity for activity in member_activities if activity.type in valid_types
        ]

        if activities[0].type == discord.ActivityType.custom:
            mood = activities[0].to_dict()
            if activities[0].emoji and activities[0].emoji.is_custom_emoji():
                mood["emoji"]["id"] = str(mood["emoji"]["id"])
            activities.pop(0)

        if activities:
            activities.sort(key=lambda activity: activity.type)
            main_activity = activities[0]

        if main_activity:
            activity_to_be_returned["type"] = str(main_activity.type).replace(
                "ActivityType.", ""
            )
            match main_activity.type:
                case discord.ActivityType.listening:
                    if isinstance(main_activity, discord.Spotify):
                        activity_to_be_returned.update(
                            {
                                "platform": "Spotify",
                                "name": main_activity.title,
                                "artists": main_activity.artists,
                                "album": {
                                    "name": main_activity.album,
                                    "cover": main_activity.album_cover_url,
                                },
                                "timestamps": {
                                    "start": str(main_activity.start),
                                    "end": str(main_activity.end),
                                },
                            }
                        )
                    else:
                        activity_to_be_returned.update(
                            {
                                "name": main_activity.name,
                                "details": main_activity.details,
                                "state": main_activity.state,
                                "timestamps": main_activity.timestamps,
                                "assets": main_activity.assets,
                            }
                        )
                case discord.ActivityType.streaming:
                    activity_to_be_returned.update(
                        {
                            "platform": main_activity.platform,
                            "details": main_activity.details,
                            "game": main_activity.game,
                            "twitch_name": main_activity.twitch_name,
                            "timestamps": {
                                "start": str(main_activity.created_at),
                            },
                            "url": main_activity.url,
                            "assets": main_activity.assets,
                        }
                    )
                case _:
                    activity_to_be_returned.update(
                        {
                            "name": main_activity.name,
                            "application_id": str(main_activity.application_id),
                            "details": main_activity.details,
                            "state": main_activity.state,
                            "timestamps": main_activity.timestamps,
                            "assets": main_activity.assets,
                        }
                    )
        return activity_to_be_returned if activity_to_be_returned else None, mood
    except Exception:  # noqa: BLE001
        return None, None


def extract_urls(data):
    urls = []
    url_pattern = re.compile(r'https?://[^\s\'",]+')

    ignored_keys = ["display_name", "username"]

    # Recursive function to handle nested structures
    def recurse(item):
        if isinstance(item, str):
            urls.extend(url_pattern.findall(item))
        elif isinstance(item, (list, tuple, set)):
            for sub_item in item:
                recurse(sub_item)
        elif isinstance(item, dict):
            for key, value in item.items():
                if key not in ignored_keys:
                    recurse(value)

    recurse(data)
    return urls
