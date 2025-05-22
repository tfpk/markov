/*eslint prefer-const: "off"*/
/*eslint @typescript-eslint/no-unused-vars: "off"*/
/*eslint @typescript-eslint/no-explicit-any: 0*/
'use client'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Corpus from './Corpus';
import TSP from './tsp';
import { useState, useMemo } from 'react';

function getRandomInt(min: any, max: any) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let randVal = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  return randVal
}

export default function App() {
  const [corpus, setCorpus] = useState('');
  const [genWords, setGenWords] = useState('');
  const getWordList = (text: any) => {
    return text
      .toLowerCase()
      .replaceAll(".", " FULLSTOP ")
      .split(/[^\w\.']+/) // Split text by whitespace
      .filter((word) => word.trim() !== '') // Filter out empty strings
      .map((word, index) => (word)); // Map to list of words with unique IDs
  };
  const [points, setPoints] = useState([]);


  const wordStages = useMemo(() => {
    const words = getWordList(corpus);
    const wordPairs = words.map((_, i, arr) => arr.slice(i, i + 2)).slice(0, -1);
    const sortedWordPairs = [...wordPairs].toSorted((a, b) => a[0].localeCompare(b[0]));
    const countedWordPairs = sortedWordPairs.reduce((acc, val) => {
      if (!(acc.hasOwnProperty(val[0]))) {
        acc[val[0]] = {}
      }
      if (!(acc[val[0]].hasOwnProperty(val[1]))) {
        acc[val[0]][val[1]] = 0;
      }
      acc[val[0]][val[1]] += 1;
      return acc;
    }, {});
    return {
      words: words,
      wordPairs: wordPairs,
      sortedWordPairs: sortedWordPairs,
      countedWordPairs: countedWordPairs
    };
  }, [corpus]);

  let wordList = [];
  let key = 0;
  Object.keys(wordStages.countedWordPairs).forEach((word) => {
    let all_dests = Object.values(wordStages.countedWordPairs[word]).reduce((a, b) => a + b, 0);
    Object.keys(wordStages.countedWordPairs[word]).forEach((destWord) => {
      wordList.push(
        <li key={key}>{word} - {destWord}  (<code className="text-blue-300">{wordStages.countedWordPairs[word][destWord]}/{all_dests}</code>)</li>
      );
      key += 1;
    });
  });

  const clickGenerate = () => {
    const lastWordIndex = genWords.lastIndexOf(' ');
    let lastWord = 'FULLSTOP';
    if (lastWordIndex > -1) {
      lastWord = genWords.slice(lastWordIndex + 1);
      console.log(lastWord)
    }

    const nextWords = wordStages.countedWordPairs[lastWord];
    const totalProbability = Object.values(nextWords).reduce((a, b) => a + b, 0);
    const indexProb = getRandomInt(0, totalProbability);

    let count = 0;
    let candidateWords = Object.keys(nextWords)
    console.log(indexProb)
    for (let nw of candidateWords) {
      count += nextWords[nw];
      if (indexProb < count) {
        setGenWords(genWords + ' ' + nw);
        break
      }
    }
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Corpus</Tab>
        <Tab>Pairs</Tab>
        <Tab>Sorted Pairs</Tab>
        <Tab>Graph</Tab>
        <Tab>Generate</Tab>
        <Tab>TSP</Tab>
      </TabList>

      <TabPanel>
        <Corpus corpus={corpus} setCorpus={setCorpus}/>
      </TabPanel>

      <TabPanel>
        <ul className="text-3xl max-w-[60%] mx-auto">
          {wordStages.wordPairs.slice(0, 1000).map((p, i) => (<li key={i}>{p[0]} - {p[1]}</li>) )}
        </ul>
      </TabPanel>

      <TabPanel>
        <ul className="text-3xl max-w-[60%] mx-auto">
          {wordStages.sortedWordPairs.slice(0, 1000).map((p, i) => (<li key={i}>{p[0]} - {p[1]}</li>) )}
        </ul>
      </TabPanel>

      <TabPanel>
        <ul className="text-3xl max-w-[60%] mx-auto">
          {wordList.slice(0, 1000)}
        </ul>
      </TabPanel>

      <TabPanel>
        <h2>Generate</h2>
        <p className="text-4xl max-w-[60%] mx-auto">
          {genWords}
        </p>
        <div className="flex items-center justify-center">
          <div className="flex w-4/5 justify-between">
            <button className="flex-1 mx-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={clickGenerate}>
              Generate Word
            </button>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <TSP points={points} setPoints={setPoints}/>
      </TabPanel>
    </Tabs>
  );
}

