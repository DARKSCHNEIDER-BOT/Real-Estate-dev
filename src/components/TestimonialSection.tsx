import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied clients about their experience finding their
            dream homes with Nigerian Estates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6 relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Nigerian Estates helped me find my dream home in Lekki. The
                process was smooth and their team was professional throughout. I
                couldn't be happier with my new property!"
              </p>
            </CardContent>
          </Card>

          {/* Testimonial 2 */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6 relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                    alt="Sarah Johnson"
                  />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">
                    Abuja, Nigeria
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The search filters made it so easy to find properties that
                matched my exact requirements. I found a beautiful apartment in
                Abuja within days of starting my search!"
              </p>
            </CardContent>
          </Card>

          {/* Testimonial 3 */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6 relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
                    alt="Michael Okonkwo"
                  />
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Michael Okonkwo</h4>
                  <p className="text-sm text-muted-foreground">
                    Port Harcourt, Nigeria
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a real estate investor, I appreciate the detailed
                information provided for each property. Nigerian Estates has
                become my go-to platform for finding investment opportunities."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
