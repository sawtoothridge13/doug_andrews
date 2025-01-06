import MovinOn from '../../public/movin_on.svg';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 py-20">
          <h1 className="font-american-typewriter text-4xl text-center font-bold text-gray-800">
            Doug Andrews
          </h1>
        </div>
      </header>

      <main className="bg-white flex-grow flex items-center justify-center pl-16 relative">
        <div className="w-full max-w-3xl relative">
          <MovinOn className="w-full h-auto text-black relative z-0" />
        </div>
      </main>

      <footer className="bg-gray-100 py-8 relative z-10">
        <div className="text-black container mx-auto px-4">
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <a
              href="mailto:info@doug-andrews.net"
              className="text-black-600 hover:text-blue-800"
            >
              info@doug-andrews.net
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
