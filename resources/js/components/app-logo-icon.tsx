import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src="/images/dtilogo.png" alt="DTI Logo" className="w-20 h-auto object-contain relative" />
    );
}
