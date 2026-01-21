import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import AdVideo from '../components/video/AdVideo';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="AdVideo"
                component={AdVideo as any}
                durationInFrames={450}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    script: "VISUAL: Placeholder Image\nVO: Placeholder VO",
                    product: {
                        title: "Placeholder",
                        image: "",
                        images: [],
                        description: "",
                        features: [],
                        url: ""
                    }
                }}
            />
        </>
    );
};

registerRoot(RemotionRoot);
