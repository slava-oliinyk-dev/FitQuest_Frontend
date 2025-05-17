import {
	main360,
	main360x2,
	main500,
	main500x2,
	main660,
	main660x2,
	main768,
	main768x2,
	main992,
	main992x2,
	main1366,
	main1366x2,
	main1920,
	main1920x2,
	main2560,
	main2560x2,
} from '../../../assets/images';

export const mainScreenSources = [
	{ media: '(max-width: 360px)', srcSet: `${main360} 1x, ${main360x2} 2x` },
	{ media: '(max-width: 550px)', srcSet: `${main500} 1x, ${main500x2} 2x` },
	{ media: '(max-width: 660px)', srcSet: `${main660} 1x, ${main660x2} 2x` },
	{ media: '(max-width: 768px)', srcSet: `${main768} 1x, ${main768x2} 2x` },
	{ media: '(max-width: 992px)', srcSet: `${main992} 1x, ${main992x2} 2x` },
	{ media: '(max-width: 1366px)', srcSet: `${main1366} 1x, ${main1366x2} 2x` },
	{ media: '(max-width: 1920px)', srcSet: `${main1920} 1x, ${main1920x2} 2x` },
	{ media: '(min-width: 1921px)', srcSet: `${main2560} 1x, ${main2560x2} 2x` },
];

export const mainScreenImgSrcSet = `
  ${main360} 360w,
  ${main500} 550w,
  ${main660} 660w,
  ${main768} 768w,
  ${main992} 992w,
  ${main1366} 1366w,
  ${main1920} 1920w,
  ${main2560} 2560w
`;
export const mainScreenImgSizes = `
  (max-width:360px) 360px,
  (max-width:550px) 550px,
  (max-width:660px) 660px,
  (max-width:768px) 768px,
  (max-width:992px) 992px,
  (max-width:1366px) 1366px,
  (max-width:1920px) 1920px,
  2560px
`;
