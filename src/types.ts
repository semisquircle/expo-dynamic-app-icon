export type DynamicAppIconRegistry = {
	IconName: string;
};

export type IconDimensions = {
	// The scale of the icon itself, affects file name and width/height when omitted
	scale: number;
	// Both width and height of the icon, affects file name only
	size: number;
	// The width, in pixels, of the icon. Generated from `size` + `scale` when omitted
	width?: number;
	// The height, in pixels, of the icon. Generated from `size` + `scale` when omitted
	height?: number;
	// Special target of the icon dimension, if any
	target?: null | "ipad";
};

export type IconVariant = "light" | "dark" | "tinted";

export type AssetImage = {
	filename?: string;
	idiom: "universal";
	platform: "ios";
	size: string;
	appearances?: { appearance: "luminosity"; value: IconVariant }[];
};

export type AndroidAdaptiveIconConfig = {
	foregroundImage: string;
	monochromeImage?: string;
} & (
	| { backgroundColor?: string; backgroundImage: string }
	| { backgroundColor: string; backgroundImage?: string }
);

export type IconSet = Record<string, IconSetProps>;
export type IosIconSet = string | { light: string; dark?: string; tinted?: string };
export type IconSetProps = {
	ios?: IosIconSet;
	android?: string | AndroidAdaptiveIconConfig;
};

export type PluginProps = {
	icons: IconSet;
	dimensions: Required<IconDimensions>[];
};
