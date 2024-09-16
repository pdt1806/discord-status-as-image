import { formatDate, getEmojiURLfromCDN } from '../src/utils/tools';
import { ActivityType, MoodType } from '../src/utils/types';

export const smallcardSvgContent = ({
  width,
  height,
  bg1,
  bg2,
  background,
  angle,
  avatar,
  displayName,
  statusImage,
  createdDate,
  activity,
  mood,
  discordLabel,
  textColor,
  titleSize,
}: {
  width: number;
  height: number;
  bg1: string;
  bg2: string;
  background: string;
  angle: string;
  avatar: string;
  displayName: string;
  statusImage: string;
  createdDate: string | null;
  activity: ActivityType | null;
  mood: MoodType | null;
  discordLabel: string;
  textColor: string;
  titleSize: number;
}) =>
  `<svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 300 100"
          width="${width}px"
          height="${height}px"
        >
          <defs>
          ${
            bg1
              ? `<linearGradient id="bgGradient" x1="0%" y1="100%" x2="0%" y2="0%" gradientTransform="rotate(${angle} .5 .5)">
                <stop offset="0%" style="stop-color:#${bg1};stop-opacity:1" />
                <stop offset="80%" style="stop-color:#${bg2};stop-opacity:1" />
              </linearGradient>`
              : ''
          }
            <style type="text/css">@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700');.cls-1{fill:none;}.cls-2{fill:${bg1 ? 'url(#bgGradient)' : background};}.cls-30{fill:#24934f;fill-rule:evenodd;}.cls-31{fill:#5d5f6b;fill-rule:evenodd;}.cls-32{fill:#f0b232;fill-rule:evenodd;}.cls-33{fill:#ec3e4a;fill-rule:evenodd;}.cls-4{clip-path:url(#clip-path);}.cls-10,.cls-5,.cls-6{isolation:isolate;}.cls-6{font-size:${22 * (titleSize / 100)}px;font-family:Noto Sans TC,system-ui;font-weight:500;}.cls-10,.cls-6,.cls-9{fill:${textColor};}.cls-7{letter-spacing:-0.021em;}.cls-8{letter-spacing:-0.01501em;}.cls-10{font-size:8.85069px;font-family:Noto Sans TC,system-ui; font-weight:400;}.cls-11{fill:#5865f2;}.cls-12{fill:#fff;}}</style>
            <clipPath id="clip-path">
              <path
                class="cls-1"
                d="M45.8312,19.77937a30.30156,30.30156,0,0,1,27.90485,42.073l-.26383.54773-.74423-.404a11.00057,11.00057,0,0,0-14.41,14.41l.52766.972-1.22624.59108A30.28826,30.28826,0,1,1,45.8312,19.77937Z"
              />
            </clipPath>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <rect class="cls-2" width="360" height="120" />
              ${statusImage}
              <g class="cls-4">
                <image
                  id="img0"
                  class="cls-5"
                  width="1440"
                  height="1440"
                  transform="translate(15.54643 19.77937) scale(0.04206)"
                  xlink:href="${avatar}"
                />
              </g>
              <text
                class="cls-6"
                transform="translate(90.67773 ${createdDate ? '50.64147' : '59.5'})"
              >
                ${displayName}
              </text>
              ${
                createdDate && !(activity || mood)
                  ? `
                  <path
                    class="cls-9"
                    d="M99.34572,68.42014a1.19712,1.19712,0,0,1-1.11652-1.19705c0-.02122.00042-.04244.00166-.06366v.00291c-.00124-.02-.00207-.04327-.00207-.067a1.19019,1.19019,0,0,1,1.11362-1.19082h.00331a1.1838,1.1838,0,0,1,1.11734,1.18457c0,.0258-.00085.05118-.00246.07656v-.00333c.00123.02081.002.04535.002.0699a1.18658,1.18658,0,0,1-1.114,1.18751h-.00331Zm-4.12268,0a1.19712,1.19712,0,0,1-1.1165-1.19705c0-.02122.00041-.04244.00165-.06366v.00291c-.00124-.02-.00207-.04327-.00207-.067a1.19017,1.19017,0,0,1,1.11361-1.19082H95.223a1.18379,1.18379,0,0,1,1.11733,1.18457c0,.0258-.00083.05118-.00248.07656v-.00333c.00124.02.00207.04327.00207.067a1.19013,1.19013,0,0,1-1.11361,1.19081Zm6.3569-5.69942a9.86118,9.86118,0,0,0-2.46342-.77848l-.06165-.00915-.007-.00084a.03836.03836,0,0,0-.03348.01957h0a6.54608,6.54608,0,0,0-.29661.6033L98.7,62.60131a9.10148,9.10148,0,0,0-1.4181-.10777,9.479,9.479,0,0,0-1.47144.11442l.05336-.00707a6.35774,6.35774,0,0,0-.33632-.68153l.017.032a.03939.03939,0,0,0-.03434-.01956l-.00662.00041h.00041a10.13173,10.13173,0,0,0-2.58793.81427l.06246-.02663a.03461.03461,0,0,0-.01655.01414h0a10.4873,10.4873,0,0,0-1.88718,6.03143,10.70729,10.70729,0,0,0,.05833,1.11679l-.00372-.04575a.04326.04326,0,0,0,.01613.02911h0a10.16591,10.16591,0,0,0,3.02519,1.55532l.07281.02.01158.00162a.03944.03944,0,0,0,.03186-.01579h0a7.26961,7.26961,0,0,0,.61431-.99526l.01944-.04164a.04072.04072,0,0,0,.00413-.01788.03976.03976,0,0,0-.02564-.037h-.00042a6.71266,6.71266,0,0,1-.99985-.48141l.03185.0175a.04012.04012,0,0,1-.01985-.03453.03947.03947,0,0,1,.01572-.03166h0c.06494-.04907.13031-.09986.19235-.15141a.03885.03885,0,0,1,.02442-.00875l.01571.00333h-.00041a7.19424,7.19424,0,0,0,3.11744.6994,7.272,7.272,0,0,0,3.16171-.7186l-.04425.0192a.03508.03508,0,0,1,.01655-.00379.03881.03881,0,0,1,.02439.00875h0c.062.05163.127.10318.1928.15187a.04106.04106,0,0,1,.0157.032.04057.04057,0,0,1-.019.03414h0a6.09572,6.09572,0,0,1-.92455.44851l-.04349.01494a.04038.04038,0,0,0-.02563.03708.03828.03828,0,0,0,.00454.01827v-.00039a8.28548,8.28548,0,0,0,.64988,1.06013l-.01655-.02369a.03952.03952,0,0,0,.03186.01664l.012-.00162h-.00039a10.24383,10.24383,0,0,0,3.12984-1.59441l-.02694.01951a.04036.04036,0,0,0,.01616-.02872h0a10.15969,10.15969,0,0,0,.05626-1.088,10.45789,10.45789,0,0,0-1.91244-6.04728l.02155.03245a.03234.03234,0,0,0-.0157-.015h0Z"
                  />
                  <text class="cls-10" transform="translate(108.38086 70.42077)">
                    ${formatDate(createdDate)}
                  </text>
                `
                  : ''
              }
              ${
                activity || mood
                  ? `
                ${
                  mood && mood.emoji && mood.emoji.name && !mood.emoji.id
                    ? `<text class="cls-10" transform="translate(92 70.42077)" >
                      ${mood.emoji.name}
                      </text>`
                    : ''
                }
                      ${
                        mood && mood.emoji && mood.emoji.id
                          ? `<image transform="translate(92 62.5)" width="10" height="10" xlink:href="${getEmojiURLfromCDN(mood.emoji)}" preserveAspectRatio="none"></image>`
                          : ''
                      }
                    <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; transform: translate(${mood && mood.emoji ? '107.38086px' : '92px'}, 57.8px);">
                  ${
                    activity && (mood?.state === 'Custom Status' || !mood)
                      ? `
                      <div class="cls-10" style="color: ${textColor}">
                          ${
                            {
                              listening: 'Listening to ',
                              watching: 'Watching ',
                              playing: 'Playing ',
                              streaming: 'Streaming ',
                              competing: 'Competing in ',
                            }[activity.type]
                          }
                          <span style="font-weight: 600;">
                              ${
                                {
                                  listening: activity.platform,
                                  watching: activity.name,
                                  playing: activity.name,
                                  streaming: activity.details,
                                  competing: activity.name,
                                }[activity.type]
                              }
                          </span>
                      </div>
                  `
                      : mood
                        ? `<div class="cls-10" style="color: ${textColor}">${mood.state !== 'Custom Status' ? limitMoodLength(mood.state) : ''}</div>`
                        : ''
                  }
                      <div style="margin-left: 5px; transform: translateY(-1px); visibility: ${activity ? 'visible' : 'hidden'}">
                          <svg xmlns="http://www.w3.org/2000/svg" style="width: 8px; height: 8px" viewBox="0 0 36.9945 36.9945" fill="${textColor}">
                              <path d="M22.1967 25.8961H7.39891V22.1967H22.1967V25.8961ZM29.5956 18.4972H7.39891V14.7978H29.5956V18.4972ZM29.5956 11.0983H7.39891V7.39891H29.5956V11.0983ZM32.8843 0H4.11024C1.82738 0 0 1.82746 0 4.11002V32.8845C0 35.1558 1.83848 36.9945 4.11024 36.9945H32.8843C35.1561 36.9945 36.9945 35.1558 36.9945 32.8845V4.11002C36.9945 1.82746 35.145 0 32.8843 0Z" />
                          </svg>
                      </div>
              </div>
          </foreignObject>
                `
                  : ''
              }
              ${
                discordLabel === 'true'
                  ? `
              <path class="cls-11" d="M300.42,79.82H228.7a3.32,3.32,0,0,0-3.32,3.33V99.76h75Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M254,86.78h2.92a4.37,4.37,0,0,1,1.79.33,2.39,2.39,0,0,1,1.09.92,2.6,2.6,0,0,1,.37,1.36,2.55,2.55,0,0,1-.38,1.35,2.61,2.61,0,0,1-1.16,1,4.74,4.74,0,0,1-1.92.35H254Zm2.68,3.94a1.52,1.52,0,0,0,1.09-.36,1.42,1.42,0,0,0,0-1.9,1.42,1.42,0,0,0-1-.34h-.91v2.6Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M264.5,92.05a3.72,3.72,0,0,1-1.09-.46V90.34a2.86,2.86,0,0,0,1,.47,4.49,4.49,0,0,0,1.2.19,1,1,0,0,0,.41-.08.2.2,0,0,0,.14-.17.25.25,0,0,0-.08-.18.59.59,0,0,0-.29-.13l-.9-.21a2.3,2.3,0,0,1-1.1-.5,1.2,1.2,0,0,1,0-1.6,1.76,1.76,0,0,1,.81-.5,3.63,3.63,0,0,1,1.23-.18,4.46,4.46,0,0,1,1.15.13,3.3,3.3,0,0,1,.87.35v1.19a3.39,3.39,0,0,0-.81-.34,3.81,3.81,0,0,0-.95-.12c-.47,0-.71.08-.71.24a.18.18,0,0,0,.11.17,1.82,1.82,0,0,0,.4.11l.75.14a2.26,2.26,0,0,1,1.09.45,1.35,1.35,0,0,1-.24,2,3,3,0,0,1-1.69.4A4.82,4.82,0,0,1,264.5,92.05Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M269.81,91.89a2.18,2.18,0,0,1-1-.86,2.28,2.28,0,0,1-.32-1.22,2.21,2.21,0,0,1,.34-1.22,2.25,2.25,0,0,1,1-.84,3.62,3.62,0,0,1,1.56-.3,3.34,3.34,0,0,1,1.86.47V89.3a2.63,2.63,0,0,0-.61-.29,2.1,2.1,0,0,0-.75-.11,2,2,0,0,0-1.09.25.77.77,0,0,0-.29,1,.71.71,0,0,0,.28.29,1.92,1.92,0,0,0,1.11.26,2.64,2.64,0,0,0,.74-.1,3.14,3.14,0,0,0,.62-.27v1.34a3.56,3.56,0,0,1-1.91.49A3.36,3.36,0,0,1,269.81,91.89Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M275.14,91.89a2.24,2.24,0,0,1-1.33-2.09,2.15,2.15,0,0,1,.34-1.21,2.25,2.25,0,0,1,1-.84,4.08,4.08,0,0,1,3.07,0,2.33,2.33,0,0,1,1,.83,2.21,2.21,0,0,1,.34,1.22,2.33,2.33,0,0,1-.34,1.23,2.26,2.26,0,0,1-1,.86,3.9,3.9,0,0,1-3.07,0Zm2.28-1.34a1,1,0,0,0,.27-.72,1,1,0,0,0-.27-.72,1,1,0,0,0-.75-.27,1,1,0,0,0-.75.27,1.07,1.07,0,0,0,0,1.44,1,1,0,0,0,.75.28A1,1,0,0,0,277.42,90.55Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M284,87.72v1.64a1.28,1.28,0,0,0-.74-.19,1.14,1.14,0,0,0-.92.37,1.69,1.69,0,0,0-.32,1.13v1.39h-1.84V87.64H282v1.41a2.24,2.24,0,0,1,.49-1.14,1.1,1.1,0,0,1,.85-.37A1.33,1.33,0,0,1,284,87.72Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M290.14,86.62v5.44H288.3v-1a1.79,1.79,0,0,1-.71.85,2.26,2.26,0,0,1-1.17.29,2,2,0,0,1-1.08-.3,2,2,0,0,1-.73-.84,3,3,0,0,1-.25-1.21,2.67,2.67,0,0,1,.27-1.24,2.09,2.09,0,0,1,.77-.87,2.16,2.16,0,0,1,1.14-.3,1.72,1.72,0,0,1,1.76,1.14v-2ZM288,90.53a1,1,0,0,0,.28-.72.88.88,0,0,0-.28-.68,1.16,1.16,0,0,0-1.49,0,.93.93,0,0,0-.27.69.94.94,0,0,0,.28.71,1.15,1.15,0,0,0,1.48,0Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M247.19,85.47a10.65,10.65,0,0,0-2.81-.87c-.13.24-.25.48-.36.73a10.87,10.87,0,0,0-3.12,0,5.49,5.49,0,0,0-.36-.73,11.16,11.16,0,0,0-2.81.87,11.54,11.54,0,0,0-2,7.78h0A11.55,11.55,0,0,0,239.16,95a8.24,8.24,0,0,0,.74-1.2,6.89,6.89,0,0,1-1.16-.56L239,93a8.07,8.07,0,0,0,6.89,0l.28.21a7.28,7.28,0,0,1-1.16.56,8.24,8.24,0,0,0,.74,1.2,11.55,11.55,0,0,0,3.45-1.74h0A11.51,11.51,0,0,0,247.19,85.47Zm-7,6.21a1.38,1.38,0,1,1,1.23-1.37A1.3,1.3,0,0,1,240.2,91.68Zm4.53,0a1.38,1.38,0,0,1,0-2.74A1.29,1.29,0,0,1,246,90.31,1.3,1.3,0,0,1,244.73,91.68Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M262.59,87.29a.92.92,0,1,1-.92-.83A.88.88,0,0,1,262.59,87.29Z" transform="translate(-0.42 0.24)"/>
              <path class="cls-12" d="M260.76,88.68a2.33,2.33,0,0,0,1.83,0v3.4h-1.83Z" transform="translate(-0.42 0.24)"/>
              `
                  : ''
              }
            </g>
          </g>
        </svg>`
    .replace(/\s+/g, ' ')
    .trim();

const limitMoodLength = (value: string) => {
  if (value.length < 33) return value;
  return `${value.slice(0, 30)}...`;
};
