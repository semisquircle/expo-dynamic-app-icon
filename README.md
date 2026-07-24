# @semisquircle/expo-dynamic-app-icon

The **definitive** dynamic app icon package for React Native Expo!\
Expo SDK 53+ supported.

## FAQ
#### *Why did you make this package?*
- This package is a potpourri of various similar projects that have become outdated since the release of iOS 26 + Android 17. It aims to provide the widest icon format support for both platforms, but it is recommended to explore other packages for specific use cases:
  - [expo-dynamic-app-icon](https://github.com/outsung/expo-dynamic-app-icon)
  - [@howincodes/expo-dynamic-app-icon](https://github.com/howincodes/expo-dynamic-app-icon)
  - [expo-awesome-app-icon](https://github.com/oobagi/expo-awesome-app-icon)
  - [@bsky.app/expo-dynamic-app-icon](https://github.com/bluesky-social/expo-dynamic-app-icon)
  - [@variant-systems/expo-dynamic-app-icon](https://github.com/Variant-Systems/expo-dynamic-app-icon)
#### *Does this package support light, dark, and tinted variants on iOS?*
- Yes! If only one iOS image is provided, all three will be generated as the same image.
#### *Does this package support adaptive icon background, foreground, and monochrome layers on Android?*
- Yes! If only one Android image is provided, the legacy Android icon format will be generated.
#### *Does this package force the app to immediately close on Android when changing icons?*
- No! See the [Platform Behavior](#platform-behavior) section.
#### *Does this package necessitate a system alert on iOS when changing icons?*
- Unfortunately yes. iOS 26 has patched previous private API workarounds that would suppress the alert popup when triggering `setAlternateIconName`. See the [Platform Behavior](#platform-behavior) section.

## Installation
```sh
npx expo install @semisquircle/expo-awesome-app-icon
```

## Usage
### **Set App Icon**
```ts
import { setAppIcon } from "@semisquircle/expo-dynamic-app-icon";

// Change app icon to 'red' (returns a Promise)
const result = await setAppIcon("red");

// Reset to default icon
await setAppIcon(null);
```

#### Parameters:
```ts
setAppIcon(
  name: IconName | null,
  isInBackground?: boolean
): Promise<IconName | "DEFAULT" | false>
```

| Parameter        | Type               | Default | Description                                                                                                                    |
| ---------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `name`           | `IconName \| null` | `null`  | The icon name to switch to. Pass `null` to reset to the default icon.                                                          |
| `isInBackground` | `boolean`          | `true`  | - `true`: Icon changes silently in the background (Android only).<br>- `false`: Immediate change, with risk of app kill. |

#### Returns (Promise):
- `"DEFAULT"` if reset to the original icon.
- The **new icon name** on success.
- `false` if an error occurs.

---

### **Get Current Icon**
```ts
import { getAppIcon } from "@semisquircle/expo-dynamic-app-icon";

// Get the current app icon name
const icon = await getAppIcon();
console.log(icon); // "red" (or "DEFAULT" if not changed)
```

---

### Platform Behavior:
- **iOS:** `await setAppIcon("dark")` resolves **after** the icon change completes (or fails). The return value accurately reflects success/failure.
- **Android:** `await setAppIcon("dark")` resolves **immediately** after queuing the change. The actual icon switch happens when the app enters the background. This means the promise always resolves with the icon name, even if the change hasn't been applied yet.

### Notes:
- **Android limitations:**
  Android does **not** support icon changes while the app is running in the foreground.
  To work around this, the icon is changed when the app enters the **Pause state** (background).

- **Pause state** can also trigger during events like permission dialogs.
  To avoid unwanted icon changes, a **5-second delay** is added to ensure the app is truly in the background.

- To disable the delay and apply the icon change immediately (with the risk of it running during permission dialogs or other pause events), set:

  ```ts
  await setAppIcon("red", false);
  ```

  - On **iOS**, `isInBackground` has **no effect** and the system alert will be triggered regardless.
  - On **Android**, it applies the icon change right away without waiting.

## Configure
Add the plugin to your `app.json`:
```jsonc
{
  // ...
  "plugins": [
    [
      "@semisquircle/expo-dynamic-app-icon",
      {
        // Minimal example
        "christmas": {
          // Automatically generates dark & tinted variants
          "ios": "./assets/icons/ios/christmas.png",
          // Automatically generates legacy android:icon and android:roundIcon launchers
          "android": "./assets/icons/android/christmas.png",
        },
        // Full example
        "halloween": {
          "ios": {
            "light": "./assets/icons/ios/light.png",
            // Optional dark icon
            "dark": "./assets/icons/ios/dark.png",
            // Optional tinted icon
            "tinted": "./assets/icons/ios/tinted.png",
          },
          "android": {
            "foregroundImage": "./assets/icons/android/foreground.png",
            // Optional adaptive background color (overriden by "backgroundImage")
            "backgroundColor": "#FFA500",
            // Optional adaptive background image
            "backgroundImage": "./assets/icons/android/background.png",
            // Optional themed icon
            "monochromeImage": "./assets/icons/android/monochrome.png",
          },
        },
      },
    ],
  ],
}
```

---

The module also exports the config plugin type, so dynamic configuration is supported (if not recommended) for `app.config.js`/`app.config.ts`:
```ts
import "tsx/cjs";
import { ConfigContext, ExpoConfig } from "expo/config";
import type { DynamicIconSet } from "@semisquircle/expo-dynamic-app-icon";

const icons = ["christmas", "halloween", "thanksgiving", "juneteenth", "pride"];
const dynamicAppIcons = icons.reduce<DynamicIconSet>((acc, name) => {
  acc[name] = {
    ios: {
      light: `./assets/icons/ios/${name}-light.png`,
      dark: `./assets/icons/ios/${name}-dark.png`,,
      tinted: `./assets/icons/ios/${name}-tinted.png`,,
    },
    android: {
      backgroundImage: `./assets/icons/android/${name}-background.png`,
      foregroundImage: `./assets/icons/android/${name}-foreground.png`,
      monochromeImage: `./assets/icons/android/${name}-monochrome.png`,
    },
  };
  return acc;
}, {});

export default ({ config }: ConfigContext): ExpoConfig => ({
  // ...
  plugins: [
    [
      [
        "@semisquircle/expo-dynamic-app-icon",
        dynamicAppIcons
      ],
    ]
  ]
});
```
