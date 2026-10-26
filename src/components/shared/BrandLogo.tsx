/** Owner-approved MGTV mark. Keep its aspect ratio and original gold treatment. */
export function BrandLogo({className="h-10 w-20",decorative=false}:{className?:string;decorative?:boolean}){
 return <img src={`${import.meta.env.BASE_URL}brand/mgtv-logo-gold-v1.png`} width={1782} height={883} alt={decorative?"":"MGTV"} draggable={false} decoding="async" className={`shrink-0 object-contain ${className}`} />;
}
