"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAILLEBOX_BLE } from "@/lib/ble";

function decodeDeviceInfo(data: DataView) {
  try {
    const text = new TextDecoder().decode(data.buffer);
    return JSON.parse(text) as { serial?: string; mac?: string };
  } catch {
    return null;
  }
}

export function DeviceConnectButton({ studentId, connected, deviceName }: { studentId: string; connected?: boolean; deviceName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localDeviceName, setLocalDeviceName] = useState(deviceName || "");
  const [error, setError] = useState("");

  if (connected && !loading) {
    return <div className="rounded-full bg-[var(--bb-dark-teal)] px-5 py-3 text-sm font-semibold text-white">Device connected • {localDeviceName || deviceName || "BrailleBox"}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="btn-primary"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          try {
            const nav = navigator as Navigator & {
              bluetooth?: {
                requestDevice: (options: unknown) => Promise<unknown>;
              };
            };

            if (!nav.bluetooth) {
              throw new Error("Web Bluetooth is not available in this browser.");
            }

            const device = (await nav.bluetooth.requestDevice({
              filters: [{ services: [BRAILLEBOX_BLE.serviceUuid] }],
              optionalServices: [BRAILLEBOX_BLE.serviceUuid],
            })) as {
              name?: string;
              gatt?: {
                connect: () => Promise<{
                  getPrimaryService: (uuid: string) => Promise<{
                    getCharacteristic: (uuid: string) => Promise<{
                      readValue: () => Promise<DataView>;
                    }>;
                  }>;
                }>;
              };
            };

            const server = await device.gatt?.connect();
            if (!server) throw new Error("Could not connect to device.");

            const service = await server.getPrimaryService(BRAILLEBOX_BLE.serviceUuid);
            const deviceInfoChar = await service.getCharacteristic(BRAILLEBOX_BLE.deviceInfoUuid);
            const value = await deviceInfoChar.readValue();
            const info = decodeDeviceInfo(value);
            const resolvedName = device.name || info?.serial || "BrailleBox";
            setLocalDeviceName(resolvedName);

            await fetch(`/api/students/${studentId}/device-connect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceName: resolvedName, serial: info?.serial, mac: info?.mac }),
            });

            router.refresh();
          } catch (err) {
            const message = err instanceof Error ? err.message : "Could not connect to BrailleBox.";
            setError(message);
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Searching for BrailleBox..." : "Connect BrailleBox"}
      </button>
      {error ? <div className="text-sm text-[var(--bb-orange)]">{error}</div> : null}
    </div>
  );
}
