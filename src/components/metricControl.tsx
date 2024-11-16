
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MetricSlider } from "@/components/metricSlider";

export function MetricControlDialogWithToggle() {
    return (
      <div className="p-4">
        {/* Toggle button to open the dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Toggle className="text-yellow-400 hover:bg-stone-900">
              <Heart className="h-4 w-4" />
              <span className="ml-2">Empathy Mode</span>
            </Toggle>
          </DialogTrigger>
  
          {/* Dialog Content */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adjust Metrics</DialogTitle>
              <DialogDescription>
                Control the chatbot’s response style by adjusting the metrics below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Sliders for different metrics */}
              <MetricSlider label="Empathy" defaultValue={50} />
              <MetricSlider label="Softness" defaultValue={40} />
              <MetricSlider label="Motivational" defaultValue={60} />
              <MetricSlider label="Formality" defaultValue={70} />
              {/* Add more sliders as needed */}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button> {/* Submit Button */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  