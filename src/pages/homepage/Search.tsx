import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card } from "../../components/ui/card";
import { MapPin, Calendar, Users, Search } from "lucide-react";

export default function SearchPreview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Your Journey
          </h2>
          <p className="text-lg text-gray-600">
            Search and compare hotels to find the perfect stay for your trip
          </p>
        </div>

        <Card className="max-w-5xl mx-auto p-6 md:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin size={16} />
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="Where are you going?"
                className="bg-input-background"
              />
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center gap-2">
                <Calendar size={16} />
                Check-in
              </Label>
              <Input
                id="checkin"
                type="date"
                className="bg-input-background"
              />
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center gap-2">
                <Calendar size={16} />
                Check-out
              </Label>
              <Input
                id="checkout"
                type="date"
                className="bg-input-background"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users size={16} />
                Guests
              </Label>
              <Select>
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="5">5+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12 py-3">
              <Search size={20} className="mr-2" />
              Search Hotels
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}