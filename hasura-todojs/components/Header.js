export default function Header() {
    return (
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-wide">
            ToDo<span className="text-yellow-300">Flow</span>
          </h1>
          <p className="text-sm mt-1">Your tasks, organized beautifully.</p>
        </div>
      </header>
    );
  }
  