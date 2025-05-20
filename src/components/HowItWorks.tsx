import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, Key, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finding your dream home is easy with our simple process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Browse our extensive collection of properties using our advanced
                search filters
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tour</h3>
              <p className="text-muted-foreground">
                Schedule viewings of your favorite properties at your
                convenience
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Apply</h3>
              <p className="text-muted-foreground">
                Submit your application and get approved quickly with our
                streamlined process
              </p>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Move In</h3>
              <p className="text-muted-foreground">
                Get the keys to your new home and start your new chapter
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
