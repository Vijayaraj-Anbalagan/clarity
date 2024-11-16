
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function MetricSlider({ label, defaultValue }: { label: string; defaultValue: number }) {
    return (
      <div className="my-4">
        <Label>{label}</Label>
        <Slider defaultValue={[defaultValue]} max={100} step={1} className="w-full mt-2" />
      </div>
    );
  }