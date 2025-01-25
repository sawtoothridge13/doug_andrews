import MovinOn from '../../public/movin_on.svg';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-gray-800">
            DOUG ANDREWS
          </h1>
        </div>
      </header>

      <main className="bg-white flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-12 relative">
        <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl relative">
          <MovinOn className="w-full h-auto text-black relative z-0" />
        </div>
      </main>

      <footer className="bg-gray-100 py-6 sm:py-8 relative flex items-center flex-col z-10">
        <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/album/2dkd5BCL9A08qQO6LwpgA0?utm_source=generator"
            width="100%"
            height="150 sm:h-[175px]"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>

        <div className="text-black container mx-auto px-4">
          <div className="text-center relative z-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact</h2>
            <a
              href="mailto:info@doug-andrews.net"
              className="text-black-600 hover:text-blue-800 text-sm sm:text-base"
            >
              info@doug-andrews.net
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
