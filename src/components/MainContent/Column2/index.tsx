import {
  Box,
  Button,
  Checkbox,
  ColorPicker,
  Divider,
  FileInput,
  Group,
  HoverCard,
  NativeSelect,
  NumberInput,
  Radio,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useDISIStore } from '../../../stores/UseDISIStore';
import { bannerModeList } from '../../../utils/const';
import { formatAndUpdateHex, limitTextarea, scrollToSection } from '../../../utils/tools';
import { ColorMode, DISIForm } from '../../../utils/types';
import { generatingCards } from './utils';

const MainContentColumn2 = () => {
  const form = useForm<DISIForm>({
    initialValues: {
      username: '',
      colorMode: 'Single',
      backgroundSingle: '',
      backgroundGradient1: '',
      backgroundGradient2: '',
      backgroundGradientAngle: 0,
      displayUsername: false,
      activity: false,
      mood: false,
      created: false,
      aboutMe: '',
      bannerColor: '',
      pronouns: '',
      discordLabel: false,
    },
  });

  const {
    setSmallCardLink,
    setLargeCardLink,
    setSmallTail,
    setLargeTail,
    setColorMode,
    setWantLargeCard,
    setBannerMode,
    setCustomBannerMode,
    setExternalImageURL,
    setBannerPBID,
    setBannerFile,
  } = useDISIStore.getState();

  const bannerMode = useDISIStore((state) => state.bannerMode);
  const wantLargeCard = useDISIStore((state) => state.wantLargeCard);
  const customBannerMode = useDISIStore((state) => state.customBannerMode);
  const bannerFile = useDISIStore((state) => state.bannerFile);
  const externalImageURL = useDISIStore((state) => state.externalImageURL);
  const bannerPBID = useDISIStore((state) => state.bannerPBID);
  const colorMode = useDISIStore((state) => state.colorMode);
  const smallCardLink = useDISIStore((state) => state.smallCardLink);

  useEffect(() => {
    bannerMode === 'Custom Image Banner' && setCustomBannerMode('upload');
    bannerMode !== 'Custom Image Banner' && setCustomBannerMode('');
  }, [bannerMode]);

  return (
    <Table.Td h="100%" display="flex" style={{ alignItems: 'start', flexDirection: 'column' }}>
      <Box
        component="form"
        onSubmit={form.onSubmit(async () => {
          try {
            await generatingCards(form);
          } catch (err) {
            notifications.show({
              title: 'Error!',
              message: (err as Error).message,
              color: 'red',
              icon: null,
              autoClose: 3000,
            });
          }
        })}
        w="90%"
      >
        <TextInput
          {...form.getInputProps('username')}
          required
          id="disi-username"
          label="Username"
          minLength={2}
          maxLength={32}
          placeholder="Enter your username"
          onChange={(e) => {
            form.setValues({
              ...form.values,
              username: e.currentTarget.value,
            });
          }}
        />
        <Checkbox
          label="Show Discord label"
          mt="md"
          {...form.getInputProps('discordLabel')}
          onChange={(e) => {
            form.setValues({
              ...form.values,
              discordLabel: e.currentTarget.checked,
            });
          }}
        />
        <Checkbox
          label="Show Activity"
          mt="md"
          {...form.getInputProps('activity')}
          onChange={(e) => {
            form.setFieldValue('activity', e.currentTarget.checked);
          }}
        />
        <Checkbox
          label="Show Mood (a.k.a. custom status)"
          mt="md"
          {...form.getInputProps('mood')}
          onChange={(e) => {
            form.setFieldValue('mood', e.currentTarget.checked);
          }}
        />
        <Checkbox
          label="Show account created date"
          mt="md"
          {...form.getInputProps('created')}
          onChange={(e) => {
            form.setFieldValue('created', e.currentTarget.checked);
          }}
        />
        <Divider mt="xl" />
        <Box mt="xl">
          <Title order={4}>Background color</Title>
          <NativeSelect
            {...form.getInputProps('colorMode')}
            label="Color mode"
            data={['Single', 'Gradient', 'Discord Accent Color']}
            onChange={(e) => {
              setColorMode(e.currentTarget.value as ColorMode);
              form.setValues({
                ...form.values,
                backgroundGradient1: '',
                backgroundGradient2: '',
                backgroundGradientAngle: 0,
                backgroundSingle: '',
              });
              form.setFieldValue('colorMode', e.currentTarget.value as ColorMode);
            }}
          />
          {colorMode === 'Single' ? (
            <HoverCard shadow="md" openDelay={250}>
              <HoverCard.Target>
                <TextInput
                  placeholder="#2B2D31"
                  description="Leave blank for default Discord color"
                  label="Color"
                  {...form.getInputProps('backgroundSingle')}
                  maxLength={7}
                  minLength={7}
                  onChange={(e) =>
                    formatAndUpdateHex({
                      value: e.currentTarget.value,
                      propertyName: 'backgroundSingle',
                      form,
                    })
                  }
                />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <ColorPicker
                  value={form.values.backgroundSingle}
                  onChange={(e) => {
                    form.setValues({
                      ...form.values,
                      backgroundSingle: e.toUpperCase(),
                    });
                  }}
                />
              </HoverCard.Dropdown>
            </HoverCard>
          ) : colorMode === 'Gradient' ? (
            <Box display="flex" style={{ justifyContent: 'space-between' }} w="100%">
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#1E1E1E"
                    label="Gradient 1"
                    {...form.getInputProps('backgroundGradient1')}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) =>
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: 'backgroundGradient1',
                        form,
                      })
                    }
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient1}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient1: e.toUpperCase(),
                      });
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#FFFFFF"
                    pl={10}
                    pr={10}
                    label="Gradient 2"
                    {...form.getInputProps('backgroundGradient2')}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) =>
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: 'backgroundGradient2',
                        form,
                      })
                    }
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient2}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient2: e.toUpperCase(),
                      });
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <NumberInput
                placeholder="0"
                label="Angle"
                {...form.getInputProps('backgroundGradientAngle')}
                allowDecimal={false}
                clampBehavior="strict"
                max={360}
                min={0}
                required
                onChange={(e) => {
                  form.setValues({
                    ...form.values,
                    backgroundGradientAngle: e as number,
                  });
                }}
              />
            </Box>
          ) : (
            form.values.colorMode === 'Discord Accent Color' && (
              <Text mt="md" style={{ fontSize: '15px' }}>
                This is the color that Discord uses for the accent color of your profile. If it is
                not available, you will get the default grey background instead.
              </Text>
            )
          )}
        </Box>
        <Divider mt="xl" />
        <Box mt="xl">
          <Title order={4}>Small card settings</Title>
          <Checkbox
            label="Display Username instead of Display name"
            mt="md"
            {...form.getInputProps('displayUsername')}
            onChange={(e) => {
              form.setFieldValue('displayUsername', e.currentTarget.checked);
            }}
          />
        </Box>
        <Divider mt="xl" />
        <Checkbox
          label="Get a large card"
          mt="lg"
          onChange={(e) => {
            const { checked } = e.currentTarget;
            setWantLargeCard(checked);
            if (!checked) {
              setCustomBannerMode('');
              setBannerMode('Custom Color');
            }
          }}
        />
        {wantLargeCard && (
          <Box mt="xl">
            <Title order={4}>Large card settings</Title>
            <TextInput
              {...form.getInputProps('pronouns')}
              label="Pronouns"
              placeholder="Enter your pronouns"
              onChange={(e) => {
                form.setValues({
                  ...form.values,
                  pronouns: e.currentTarget.value.trim().length !== 0 ? e.currentTarget.value : '',
                });
              }}
            />
            <Textarea
              styles={{ input: { fontFamily: 'Noto Sans TC' } }}
              label="About me"
              minRows={5}
              maxRows={5}
              autosize
              {...form.getInputProps('aboutMe')}
              placeholder={
                'Write something about yourself.\n\nMax characters per line: 53\nMax number of lines: 5\nFont family: Noto Sans TC'
              }
              onChange={(e) => {
                form.setValues({
                  ...form.values,
                  aboutMe:
                    e.currentTarget.value.trim().length !== 0
                      ? limitTextarea(e.currentTarget.value)
                      : '',
                });
              }}
            />
            <NativeSelect
              label="Banner Mode"
              data={bannerModeList}
              onChange={(e) => {
                setBannerMode(e.currentTarget.value);
                form.setFieldValue('bannerColor', '');
                setBannerFile(null);
              }}
            />
            {bannerMode === 'Custom Color' && (
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#212121"
                    label="Banner color"
                    description="Leave blank for dark grey color"
                    {...form.getInputProps('bannerColor')}
                    maxLength={7}
                    minLength={7}
                    onChange={(e) => {
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: 'bannerColor',
                        form,
                      });
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.bannerColor}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        bannerColor: e.toUpperCase(),
                      });
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
            )}
            {bannerMode === 'Custom Image Banner' && (
              <>
                <Box>
                  <Radio.Group
                    name="customImageBannerOptions"
                    onChange={(e) => {
                      setCustomBannerMode(e);
                      setExternalImageURL('');
                      setBannerPBID('');
                      setBannerFile(null);
                    }}
                    value={customBannerMode}
                    label="Options"
                    description="Choose how you want to set your banner image."
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="upload" label="Upload new image" />
                      <Radio value="pbid" label="Use uploaded image" />
                      <Radio value="exturl" label="External image URL" />
                    </Group>
                  </Radio.Group>
                </Box>
                {customBannerMode === 'upload' && (
                  <FileInput
                    required
                    value={bannerFile}
                    accept="image/png,image/vnd.mozilla.apng,image/jpeg,image/gif,image/webp,image/avif"
                    label="Upload image"
                    description="Only accept image files."
                    placeholder="Click to upload image"
                    w="max-content"
                    maw="280px"
                    onChange={(e) => {
                      if (e) setBannerFile(e);
                    }}
                  />
                )}
                {customBannerMode === 'pbid' && (
                  <TextInput
                    w="max-content"
                    required
                    maxLength={15}
                    minLength={15}
                    placeholder="1kdufzpk70fors1"
                    value={bannerPBID}
                    onChange={(e) => {
                      const value = e.currentTarget.value.trim();
                      if (/^[a-z0-9]+$/.test(value) || value === '') {
                        setBannerPBID(value);
                      }
                    }}
                    label="Image ID"
                    description="ID of the image stored on the database"
                  />
                )}
                {customBannerMode === 'exturl' && (
                  <TextInput
                    required
                    placeholder="https://example.com/image.png"
                    value={externalImageURL}
                    onChange={(e) => {
                      setExternalImageURL(e.currentTarget.value.trim());
                    }}
                    label="Image URL"
                    description="Make sure it is a valid one."
                  />
                )}
              </>
            )}
            {bannerMode === 'Discord Accent Color' && (
              <Text mt="md" style={{ fontSize: '15px' }}>
                This is the color that Discord uses for the accent color (banner color) of your
                profile. If it is not available, you will get a dark grey banner instead.
              </Text>
            )}
            {bannerMode === 'Discord Image Banner (Nitro User Only)' && (
              <Text mt="md" style={{ fontSize: '15px' }}>
                This feature is only available for Nitro users. If you are not a Nitro user, you
                will get a solid color banner instead (accent color or dark grey).
              </Text>
            )}
          </Box>
        )}
        <Group mt="xl" gap="sm">
          <Button type="submit">Generate</Button>
          {smallCardLink !== '' && (
            <Button
              onClick={() => {
                setSmallCardLink('');
                setLargeCardLink('');
                setSmallTail('');
                setLargeTail('');
              }}
              color="orange"
            >
              Clear result
            </Button>
          )}
          <Text
            style={{ fontSize: '15px', textDecoration: 'underline', cursor: 'pointer' }}
            w="max-content"
            onClick={() => scrollToSection('how-to')}
          >
            Need help?
          </Text>
        </Group>
      </Box>
    </Table.Td>
  );
};

export default MainContentColumn2;
