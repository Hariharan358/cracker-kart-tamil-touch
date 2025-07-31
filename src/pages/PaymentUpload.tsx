import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";
import { useFCM } from "../hooks/useFCM";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Alert,
  AlertDescription,
} from "../components/ui/alert";

const PaymentUpload = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { requestPermission } = useFCM();

  const [formData, setFormData] = useState({
    orderId: "",
    mobile: "",
    screenshot: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedOrder, setUploadedOrder] = useState(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId || !formData.mobile || !formData.screenshot) {
      toast({
        title: "Please fill all fields",
        description: "Order ID, mobile number, and payment screenshot are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('orderId', formData.orderId);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('screenshot', formData.screenshot);

      const response = await fetch('http://localhost:5000/api/orders/upload-payment', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload payment screenshot');
      }

      setUploadedOrder(data.order);
      toast({
        title: "Payment uploaded successfully",
        description: "Your payment screenshot has been uploaded and is pending verification.",
      });

      // Reset form
      setFormData({
        orderId: "",
        mobile: "",
        screenshot: null,
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload payment screenshot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-orange-600">
                Upload Payment Screenshot
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Please upload a screenshot of your payment confirmation
              </p>
            </CardHeader>
            
            <CardContent>
              {!uploadedOrder ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID *</Label>
                    <Input
                      id="orderId"
                      type="text"
                      placeholder="Enter your order ID"
                      value={formData.orderId}
                      onChange={(e) => handleInputChange('orderId', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Payment Screenshot *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="screenshot" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                    {formData.screenshot && (
                      <div className="mt-2 p-2 bg-green-50 rounded border">
                        <p className="text-sm text-green-700">
                          ✓ {formData.screenshot.name} selected
                        </p>
                      </div>
                    )}
                  </div>

                  <Alert>
                    <AlertDescription className="text-sm">
                      <strong>Important:</strong> Please ensure your payment screenshot clearly shows:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Payment amount matching your order total</li>
                        <li>Transaction ID or reference number</li>
                        <li>Date and time of payment</li>
                        <li>Payment method used (UPI, Bank Transfer, etc.)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Payment Screenshot
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  <h3 className="text-xl font-semibold text-green-600">
                    Payment Screenshot Uploaded Successfully!
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Order ID:</strong> {uploadedOrder.orderId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Uploaded:</strong> {new Date(uploadedOrder.paymentScreenshot.uploadedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> Pending verification
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    We will verify your payment and update your order status shortly.
                    You will receive a notification once verified.
                  </p>
                  <Button
                    onClick={() => setUploadedOrder(null)}
                    variant="outline"
                    className="mt-4"
                  >
                    Upload Another Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentUpload; 