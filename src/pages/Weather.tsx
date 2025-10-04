import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react";

const Weather = () => {
  const forecast = [
    { day: "Mon", temp: "28°", condition: "Sunny", icon: Sun, rain: "10%" },
    { day: "Tue", temp: "27°", condition: "Partly Cloudy", icon: Cloud, rain: "30%" },
    { day: "Wed", temp: "25°", condition: "Rain", icon: CloudRain, rain: "80%" },
    { day: "Thu", temp: "26°", condition: "Rain", icon: CloudRain, rain: "70%" },
    { day: "Fri", temp: "27°", condition: "Partly Cloudy", icon: Cloud, rain: "40%" },
    { day: "Sat", temp: "28°", condition: "Sunny", icon: Sun, rain: "20%" },
    { day: "Sun", temp: "29°", condition: "Sunny", icon: Sun, rain: "10%" }
  ];

  const recommendations = [
    {
      title: "Good Day for Planting",
      description: "Temperature and humidity levels are optimal for transplanting seedlings",
      priority: "high"
    },
    {
      title: "Rain Expected Wednesday",
      description: "Delay fertilizer application. Rain predicted in 2 days",
      priority: "medium"
    },
    {
      title: "Wind Alert",
      description: "Strong winds expected. Secure greenhouse structures",
      priority: "low"
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Weather</h1>
        <p className="text-muted-foreground">Get accurate forecasts and farming recommendations</p>
      </div>

      {/* Current Weather */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-lg text-muted-foreground mb-2">Kottayam, Kerala</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Sun className="w-20 h-20 text-primary" />
              <p className="text-6xl font-bold">28°C</p>
            </div>
            <p className="text-xl mb-2">Sunny</p>
            <p className="text-muted-foreground">Feels like 30°C</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
              <Droplets className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-bold">65%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
              <Wind className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-bold">12 km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
              <CloudRain className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Rain Chance</p>
                <p className="font-bold">15%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="font-bold">10 km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <p className="text-sm font-medium mb-2">{day.day}</p>
                  <Icon className="w-8 h-8 text-primary mb-2" />
                  <p className="text-lg font-bold mb-1">{day.temp}</p>
                  <p className="text-xs text-muted-foreground text-center mb-1">{day.condition}</p>
                  <Badge variant="outline" className="text-xs">{day.rain}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Farming Recommendations */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Farming Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === "high" ? "bg-primary/5 border-primary" :
                rec.priority === "medium" ? "bg-accent/5 border-accent" :
                "bg-muted/50 border-muted"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium mb-1">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <Badge variant={
                  rec.priority === "high" ? "default" :
                  rec.priority === "medium" ? "secondary" :
                  "outline"
                }>
                  {rec.priority}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
