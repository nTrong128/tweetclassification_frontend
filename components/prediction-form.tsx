"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

const modelTypes = [
  "KNN",
  "Bayes",
  "Decision Tree",
  "Random Forest",
  "Logistic Regression",
  "SVM Linear",
  "SVM Non-linear",
];

const featureTypes = [
  {value: "tf_idf", label: "TF-IDF"},
  {value: "word2vec", label: "Word To Vector"},
  {value: "bag_of_words", label: "Bag Of Words"},
];

const predictionMap = {
  Positive: "Có liên quan đến thảm họa",
  Negative: "Không liên quan đến thảm họa",
};

export default function PredictionForm() {
  const [tweetText, setTweetText] = useState("");
  const [modelType, setModelType] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetText && modelType && featureType) {
      setIsLoading(true);
      setError(null);
      setPrediction(null);

      try {
        const response = await fetch("https://tweetclassification.onrender.com/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({text: tweetText, model: modelType, feature_type: featureType}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prediction");
        }

        const result = await response.json();

        setPrediction(result.prediction);
      } catch (err) {
        setError("An error occurred while fetching the prediction. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dự đoán Tweet có liên quan đến thảm họa</CardTitle>
        <CardDescription>
          Vui lòng nhập nội dung tweet và chọn mô hình và loại đặc trưng để dự đoán xem tweet đó có
          chứa nội dung liên quan đến thảm họa hay không.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Nhập nội dung tweet ở đây"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            name="text"
            className="min-h-[100px]"
          />
          <Select name="model" value={modelType} onValueChange={setModelType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn model" />
            </SelectTrigger>
            <SelectContent>
              {modelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="feature_type" value={featureType} onValueChange={setFeatureType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn cách trích xuất đặc trưng" />
            </SelectTrigger>
            <SelectContent>
              {featureTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="w-full"
            disabled={!tweetText || !modelType || !featureType || isLoading}>
            {isLoading ? "Đang dự đoán..." : "Dự đoán"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="w-full">
          {prediction && (
            <div
              className={`p-4 rounded-lg border ${
                prediction === "Positive"
                  ? "border-red-600 bg-red-50 dark:bg-red-950"
                  : "border-blue-600 bg-blue-50 dark:bg-blue-950"
              }`}>
              <h3 className="text-xl font-semibold mb-2">Kết quả dự đoán:</h3>
              <p
                className={`text-lg ${
                  prediction === "Positive"
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}>
                {predictionMap[prediction as keyof typeof predictionMap]}
              </p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
