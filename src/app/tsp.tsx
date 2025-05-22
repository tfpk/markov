import { useState, useEffect, useMemo } from "react";

function calculatePathLength(points) {
  if (points.length < 2) {
    return 0; // No path if there are less than 2 points
  }

  let totalLength = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  return totalLength;
}

function removeDuplicates(array) {
  return array.filter((v, i) => {
    return !array.slice(0, i).includes(v);
  })
}

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default function TSP({ points, setPoints }) {
  let [pathSet, setPathSet] = useState([[]]);
  const [updateCount, setUpdateCount] = useState(0);

  // Function to generate 20 random points
  const generateRandomPoints = () => {
    const newPoints = Array.from({ length: 20 }, () => ({
      x: Math.floor(5 + Math.random() * 754),
      y: Math.floor(5 + Math.random() * 754),
    }));
    setPoints(newPoints);
    return newPoints;
  };
  const interpolateColor = (t) => {
    const r = Math.round(255 * t); // Red increases from 0 to 255
    const g = 0; // Green remains 0
    const b = Math.round(255 * (1 - t)); // Blue decreases from 255 to 0
    return `rgb(${r}, ${g}, ${b})`;
  };
  const startSimulation = () => {
    let newPoints = generateRandomPoints();
    let paths = [];
    for (let i = 0; i < 20; i++) {
      let newPath = [...newPoints];
      shuffleArray(newPath);
      paths.push(newPath);
    }
    paths.sort((a, b) => calculatePathLength(a) > calculatePathLength(b))
    setPathSet(paths)
  }


  let pathLengths = useMemo(() => {
    return pathSet.map(calculatePathLength)
    console.log(pathSet);
  }, [pathSet]);

  const select = () => {
    if (pathSet.length < 20) {
      return;
    }
    setUpdateCount((prevCount) => prevCount + 1);
    /// Kill off 10 at random, mainly the
    const randomNums = Array.from({ length: pathSet.length }, (_, index) => {
      return Math.random() + (20 - pathSet.length) * 0.05;
    });
    const thresholdNum = [...randomNums].sort()[9];
    setPathSet(pathSet.filter((val, i) => (randomNums[i] > thresholdNum)));
    setPathId(0);
  };
  const merge = () => {
    let randomArray = [...pathSet];
    shuffleArray(randomArray);
    for (let i = 0; i < randomArray.length - 1; i += 2) {
      let cut = Math.floor(Math.random() * randomArray.length);
      let randomArray1 = randomArray[i].slice(0, cut);
      let randomArray2 = randomArray[i + 1].slice(0, cut);
      randomArray1 = removeDuplicates([...randomArray1, ...randomArray[i + 1]]);
      randomArray2 = removeDuplicates([...randomArray2, ...randomArray[i]]);
      randomArray[i] = randomArray1;
      randomArray[i + 1] = randomArray2;
    }
    setPathId(0);
    setPathSet([...pathSet, ...randomArray]);
  };
  const mutate = () => {
    let array = [...pathSet];
    array.map((item) => {
      if (Math.random() < 0.3) {
        return item;
      }
      let swap1 = Math.floor(Math.random() * item.length);
      let swap2 = Math.floor(Math.random() * item.length);
      [item[swap1], item[swap2]] = [item[swap2], item[swap1]];

      return item;
    })

  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <button className="flex-1 mx-2 p-4 bg-gray-700 rounded-lg" onClick={startSimulation}>Generate New Points</button>
        <button className="flex-1 mx-2 p-4 bg-gray-700 rounded-lg" onClick={() => select()}>Naturally Select</button>
        <button className="flex-1 mx-2 p-4 bg-gray-700 rounded-lg" onClick={() => merge()}>Merge</button>
        <button className="flex-1 mx-2 p-4 bg-gray-700 rounded-lg" onClick={() => mutate()}>Mutate</button>
    </div>
    {[[], ...pathSet].map((p, pathId) => (
      <div key={pathId}>
      <h1 className="text-2xl">{p == 0 ? `Points` : `Total Path Length: ${pathLengths[pathId - 1]}`}</h1>
      <svg width={1100} height={1100} style={{ border: "1px solid black" }}>
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={8} fill="red" />
        ))}
        {p.map((point, i) => {
          let curPath = p;
          if (i === curPath.length - 1) return null; // Skip the last point
          const t = i / (curPath.length - 2); // Normalized position
          const color = interpolateColor(t);

          return (
            <line
              key={i}
              x1={point.x}
              y1={point.y}
              x2={curPath[i + 1].x}
              y2={curPath[i + 1].y}
              stroke={color}
              strokeWidth="5"
            />
          );
        })}
      </svg>
      </div>
    ))}


    </div>
  );
}
