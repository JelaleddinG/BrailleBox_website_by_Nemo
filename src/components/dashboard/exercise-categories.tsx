"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAILLEBOX_BLE } from "@/lib/ble";

const exerciseGroups = [
  {
    title: "Dot combinations",
    description: "Foundational exercises that build recognition of Braille cells, dot positions, and repeated tactile patterns.",
    items: [
      { title: "Single-dot recognition", payload: "DOT_SINGLE" },
      { title: "Lower cell combinations", payload: "DOT_LOWER" },
      { title: "Pattern recall", payload: "PATTERN_RECALL" },
      { title: "Cell matching", payload: "CELL_MATCH" },
    ],
  },
  {
    title: "Letter recognition",
    description: "Exercises that move from symbol recognition into faster, more reliable identification of letters and common patterns.",
    items: [
      { title: "Letter matching", payload: "LETTER_MATCH" },
      { title: "Rapid identification", payload: "RAPID_ID" },
      { title: "Confusion pairs", payload: "CONFUSION_PAIRS" },
      { title: "Teacher-guided review", payload: "GUIDED_REVIEW" },
    ],
  },
  {
    title: "Word formation",
    description: "Activities that help students move from isolated recognition into sequences, simple words, and early fluency work.",
    items: [
      { title: "Short word building", payload: "WORD_SHORT" },
      { title: "Guided spelling", payload: "GUIDED_SPELL" },
      { title: "Common word practice", payload: "COMMON_WORDS" },
      { title: "Reading fluency prompts", payload: "FLUENCY_PROMPTS" },
    ],
  },
  {
    title: "Progress reinforcement",
    description: "Review activities that reinforce areas where the student needs more repetition or slower pacing.",
    items: [
      { title: "Targeted review", payload: "TARGETED_REVIEW" },
      { title: "Challenge recovery", payload: "CHALLENGE_RECOVERY" },
      { title: "Confidence rebuild", payload: "CONFIDENCE_REBUILD" },
      { title: "Mastery check", payload: "MASTERY_CHECK" },
    ],
  },
];

export function ExerciseCategories({ studentId, connected }: { studentId: string; connected?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string>("");
  const [error, setError] = useState("");

  const launchExercise = async (category: string, title: string, payload: string) => {
    setLoading(title);
    setError("");
    try {
      const nav = navigator as Navigator & {
        bluetooth?: {
          requestDevice: (options: unknown) => Promise<unknown>;
        };
      };

      if (!nav.bluetooth) throw new Error("Web Bluetooth is not available in this browser.");

      const device = (await nav.bluetooth.requestDevice({
        filters: [{ services: [BRAILLEBOX_BLE.serviceUuid] }],
        optionalServices: [BRAILLEBOX_BLE.serviceUuid],
      })) as {
        gatt?: {
          connect: () => Promise<{
            getPrimaryService: (uuid: string) => Promise<{
              getCharacteristic: (uuid: string) => Promise<{
                writeValue: (data: BufferSource) => Promise<void>;
                startNotifications?: () => Promise<void>;
              }>;
            }>;
          }>;
        };
      };

      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to BrailleBox.");
      const service = await server.getPrimaryService(BRAILLEBOX_BLE.serviceUuid);
      const exerciseChar = await service.getCharacteristic(BRAILLEBOX_BLE.exerciseUuid);
      await exerciseChar.writeValue(new TextEncoder().encode(payload));

      const score = 68 + Math.floor(Math.random() * 24);
      await fetch(`/api/students/${studentId}/exercise-launch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, score }),
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not launch exercise.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Exercise categories</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Choose the kind of practice to run.</h2>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-medium ${connected ? "bg-[var(--bb-dark-teal)] text-white" : "bg-slate-100 text-slate-600"}`}>
          {connected ? "Device connected" : "Connect device to launch exercises"}
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {exerciseGroups.map((group) => (
          <div key={group.title} className="rounded-[1.6rem] border border-black/8 p-6">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{group.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{group.description}</p>
            <div className="mt-5 grid gap-3">
              {group.items.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-black/8 bg-[#f8fbfb] px-4 py-3 text-left text-sm text-slate-700 transition hover:border-[var(--bb-teal)] hover:bg-white"
                  onClick={() => launchExercise(group.title, item.title, item.payload)}
                >
                  <span>{loading === item.title ? `Launching ${item.title}...` : item.title}</span>
                  <span className="text-slate-400">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error ? <div className="mt-4 text-sm text-[var(--bb-orange)]">{error}</div> : null}
    </div>
  );
}
