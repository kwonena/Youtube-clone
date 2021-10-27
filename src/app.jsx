import './app.css';
import VideoList from './components/videoList';

function App() {
  const [videos, setVideos] = useState([]);
  return <VideoList />
}

export default App;
