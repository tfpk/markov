/*eslint @typescript-eslint/no-explicit-any: 0*/
'use client'

import { useState } from 'react';

export default function Corpus({corpus, setCorpus}: {corpus: any, setCorpus: any}) {
  const exampleText = `
  The skier went to the snow. The snowboarder went into the snow.
  a skier met a snowboarder. The snowboarder went down the powdery snow.
  The skiier carved through the powder. powder was everywhere.
  Falling over, the snowboarder was covered. The skier went over and stopped near the
  snowboarder. The skier and the snowboarder went to the lodge. At the lodge of the skier,
  they had hot chocolate.
  `;

  const [drSeussText, setDrSeussText] = useState('');
  const [shakespeareText, setShakespeareText] = useState(''); // (await fetch('/text/dr_seuss.txt')).text()
  const clickDrSeuss = async () => {
    let text = drSeussText;
    if (!drSeussText) {
      text = await (await fetch('/text/dr_seuss.txt')).text();
      setDrSeussText(text);
    }
    setCorpus(text);
  };


  const clickShakespeare = async () => {
    let text = shakespeareText;
    if (!shakespeareText) {
      text = await (await fetch('/text/tempest.txt')).text();
      setShakespeareText(text);
    }
    setCorpus(text);
  };

	return (
		<>
			<h2>Corpus</h2>
			<textarea
				rows={20}
				cols={50}
				className="w-full bg-black text-grey text-3xl p-4 border border-gray-300 rounded-lg"
				value={corpus}
				onChange={(e) => setCorpus(e.target.value)}
				placeholder="Type or paste text here..."
			/>
			<div className="flex items-center justify-center">
				<div className="flex w-4/5 justify-between">
					<button className="flex-1 mx-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setCorpus(exampleText)}>
						Example
					</button>
					<button className="flex-1 mx-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={clickDrSeuss}>
						Dr. Seuss
					</button>
					<button className="flex-1 mx-2 p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors" onClick={clickShakespeare}>
						Shakespeare
					</button>
				</div>
			</div>
		</>
	);
}
