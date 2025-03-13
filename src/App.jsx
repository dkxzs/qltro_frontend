import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button
      className="bg-amber-300 hover:bg-slate-600"
        onClick={() => {
          alert("hello world");
        }}
      >
        Click me
      </Button>
    </div>
  );
}

export default App;
