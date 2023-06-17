/**
 *
 * @author Aydin Ghane
 * @author Mohammad Hassan Sattarian
 */

import { toFaDigits } from "./utils";

import type { RouteStep } from "osrm";

type Locale = "fa" | "en";

export default function routeText(steps: RouteStep[], locale: Locale = "fa") {
  return steps.map((step) => {
    const { name, maneuver, distance, duration } = step;

    const stepText = i18n[locale]["map-routing-unknown"];
    let instructionText = "";

    const maneuverTypeKey =
      maneuver.type !== undefined
        ? "map-routing-" + toKabab(maneuver.type)
        : "";

    const maneuverModifierKey =
      maneuver.modifier !== undefined
        ? "map-routing-" + toKabab(maneuver.modifier)
        : "";

    if (maneuver.type !== "depart")
      instructionText += i18n[locale]["map-routing-after"] + " ";

    instructionText +=
      i18n[locale][maneuverTypeKey] +
      " " +
      (maneuverModifierKey ? i18n[locale][maneuverModifierKey] + "، " : "، ") +
      i18n[locale]["map-routing-move"] +
      " " +
      i18n[locale]["map-and"] +
      " " +
      humanReadableInterval(distance, "meters") +
      " ";

    if (maneuverTypeKey !== "map-routing-arrive")
      instructionText += i18n[locale]["map-routing-in"] + " " + stepText + " ";

    instructionText += i18n[locale]["map-routing-advance"] + ".";

    const durationText = duration
      ? // i18n[locale]['map-about'] +
        " " + humanReadableInterval(duration, "seconds")
      : "";

    return { instructionText, durationText };
  });
}

export function humanReadableInterval(
  interval: number,
  type: "minutes" | "seconds" | "meters",
  locale: Locale = "fa"
) {
  const strings: string[] = [];

  if (type === "minutes") {
    const hours = Math.floor(interval / 3600);
    const minutes = Math.floor((interval / 60) % 60);

    if (hours !== 0) {
      strings.push(hours + " " + i18n[locale]["map-hours"]);
    }

    if (minutes !== 0) {
      strings.push((minutes / 5) * 5 + " " + i18n[locale]["map-minutes"]);
    }
  } else if (type === "seconds") {
    const hours = Math.floor(interval / 3600);
    const minutes = Math.floor(interval / 60);
    const seconds = Math.round(interval - hours * 3600 - minutes * 60);

    if (hours !== 0) {
      strings.push(hours + " " + i18n[locale]["map-hours"]);
    }

    if (minutes !== 0) {
      strings.push(minutes + " " + i18n[locale]["map-minutes"]);
    }

    if (seconds !== 0) {
      strings.push(seconds + " " + i18n[locale]["map-seconds"]);
    }
  }

  if (type === "meters") {
    const kilometers = Math.floor(interval / 1000);
    const meters = Math.floor(interval % 1000);

    if (kilometers !== 0) {
      strings.push(kilometers + " " + i18n[locale]["map-kilometers"]);
    }

    if (meters !== 0) {
      strings.push(
        Math.ceil(meters / 10) * 10 + " " + i18n[locale]["map-meters"]
      );
    }
  }

  const result = strings.join(" " + i18n[locale]["map-and"] + " ");
  return locale === "fa" ? toFaDigits(result) : result;
}

function toKabab(str: string) {
  return str.replace(/\s+/g, "-").toLowerCase();
}

const i18n: Record<"fa" | "en", Record<string, string>> = {
  fa: {
    "map-and": "و",
    "map-start": "شروع",
    "map-end": "پایان",
    "map-routing-depart": "از نقطه شروع",
    "map-routing-arrive": "رسیدن به مقصد",
    "map-routing-continue": "ادامه دادن",
    "map-routing-turn": "پیچیدن",
    "map-routing-on-ramp": "ورودی بزرگراه",
    "map-routing-off-ramp": "خروجی بزرگراه",
    "map-routing-end-of-road": "پایان مسیر",
    "map-routing-new-name": "تقاطع",
    "map-routing-fork": "دو راهی",
    "map-routing-rotary": "چرخش",
    "map-routing-error": "دریافت اطلاعات مسیریابی با خطا مواجه شد",
    "map-routing-after": "بعد از",
    "map-routing-in": "در",
    "map-routing-right": "به سمت راست",
    "map-routing-left": "به سمت چپ",
    "map-routing-slight-right": "کمی به راست",
    "map-routing-slight-left": "کمی به چپ",
    "map-routing-straight": "مستقیم",
    "map-routing-merge": "اتصال",
    "map-routing-continue-uturn": "ادامه‎ی دوربرگردان",
    "map-routing-uturn": "دوربرگردان",
    "map-routing-sharp-left": "پیچ تند به چپ",
    "map-routing-sharp-right": "پیچ تند به راست",
    "map-routing-move": "حرکت کرده",
    "map-routing-advance": "به پیش بروید",
    "map-routing-exit-rotary": "خروج از پیچ",
    "map-routing-exit-roundabout": "خروج از میدانَََََ",
    "map-routing-roundabout": "میدان",
    "map-routing-unknown": "مسیر",
    "map-seconds": "ثانیه",
    "map-about": "حدود",
    "map-distance": "مسافت",
    "map-duration": "مدت",
    "map-comma": "،",
    "map-kilometer": "کیلومتر",
    "map-kilometers": "کیلومتر",
    "map-meter": "متر",
    "map-meters": "متر",
    "map-minute": "دقیقه",
    "map-minutes": "دقیقه",
    "map-hour": "ساعت",
    "map-hours": "ساعت",
  },
  en: {},
};
