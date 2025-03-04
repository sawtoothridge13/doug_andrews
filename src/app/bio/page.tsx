'use client';

import Image from 'next/image';

export default function BioPage() {
  const bio = `
    Wyoming-born folk musician Doug Andrews has been crafting his own brand of Americana for over 25 years.
    Originally from Sheridan, he now calls Vienna, Austria home, where he's established himself as a respected
    figure in the European folk scene.

    Known for his soulful vocals and skilled fingerpicking guitar technique, Andrews has performed extensively
    throughout the United States and Europe. His music draws from traditional folk and country blues influences,
    connecting with audiences through straightforward storytelling and genuine connection.

    His most recent album, "Movin' On," reflects his journey as a musical expatriate who brings the spirit of
    American roots music to international audiences.
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Bio</h2>
        <div className="w-full flex justify-center">
          <Image
            src="/cb_wyo.jpg" // Reference the image directly from the public directory
            alt="Doug Andrews in Wyoming"
            width={500} // Set the width of the image
            height={300} // Set the height of the image
            className="rounded-lg shadow-md"
          />
        </div>
        <p className="whitespace-pre-line">{bio}</p>
      </div>
    </div>
  );
}
