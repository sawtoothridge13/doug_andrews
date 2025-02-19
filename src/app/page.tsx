import MovinOn from '../public/movin_on.svg';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold text-gray-800">
            DOUG ANDREWS
          </h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center bg-white px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="w-full mb-12">
            <MovinOn className="w-full h-auto text-black" />
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/album/2dkd5BCL9A08qQO6LwpgA0?utm_source=generator"
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full"
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Contact</h2>
          <a
            href="mailto:info@doug-andrews.net"
            className="text-gray-800 hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
          >
            info@doug-andrews.net
          </a>
        </div>
      </footer>
    </div>
  );
}
