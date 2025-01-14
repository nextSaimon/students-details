import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <AlertCircle className="w-24 h-24 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-center text-gray-500">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" passHref>
            <Button className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
