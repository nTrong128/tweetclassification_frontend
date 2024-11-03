import PredictionForm from "@/components/prediction-form";

export default function Home() {
  return (
    <main className="container mx-auto p-4 my-10">
      <h1 className="text-4xl font-bold mb-6 text-center"> Dự đoán Tweet thảm họa</h1>
      <PredictionForm />
    </main>
  );
}
