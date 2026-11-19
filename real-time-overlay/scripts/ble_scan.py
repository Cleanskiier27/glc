"""Scan for Bluetooth LE advertisements and print the devices heard as JSON."""
import asyncio
import json
import sys

from bleak import BleakScanner

COMPANIES = {6: "Microsoft", 76: "Apple", 117: "Samsung", 224: "Google", 135: "Garmin", 301: "Sony", 158: "Bose"}


async def main(seconds: float) -> None:
    found = await BleakScanner.discover(timeout=seconds, return_adv=True)
    devices = []
    for address, (device, adv) in found.items():
        vendor = next((COMPANIES.get(cid) for cid in adv.manufacturer_data if cid in COMPANIES), None)
        devices.append(
            {
                "name": adv.local_name or device.name or "",
                "address": address.upper(),
                "type": "le",
                "vendor": vendor,
                "rssi": adv.rssi,
                # Log-distance path loss (-59 dBm at 1 m, exponent 2.5). Rough: walls and bodies skew it a lot.
                "estimatedMeters": round(10 ** ((-59 - adv.rssi) / 25), 1),
            }
        )
    devices.sort(key=lambda d: d["rssi"], reverse=True)
    json.dump(devices, sys.stdout)


if __name__ == "__main__":
    asyncio.run(main(float(sys.argv[1]) if len(sys.argv) > 1 else 12))
