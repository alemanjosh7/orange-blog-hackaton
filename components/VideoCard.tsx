import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { BsPlay } from 'react-icons/bs';
import QRCode from 'qrcode.react';

import { Video } from './../types';

const DOMAIN_URL = 'https://legend.lnbits.com/';

const ADMIN_URL = DOMAIN_URL + 'api/v1/';
const QR_CODE = ADMIN_URL + 'qrcode/'
const ADMIN_KEY = 'eb8d3f250f0340feb18affd60baf4757';
const ADMIN_ID_FOR_USR_MNG = '031e0e39187846c5b4253b7c71ec8ed6';

const USR_MNG_URL = DOMAIN_URL + 'usermanager/api/v1/';
const USR_MNG_KEY = '4dfeea8d9ecf4611ace81e5cf929a6a9';

const LNURLP_URL = DOMAIN_URL + 'lnurlp/api/v1/links';

interface IProps {
  post: Video;
  isShowingOnHome?: boolean;
}

const VideoCard: NextPage<IProps> = ({ post: { caption, postedBy, video, _id, likes }, isShowingOnHome }) => {
  const [playing, setPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [Url, setUrl] = useState('');

  const handleUrl = (valor) => {
      setUrl(valor)
  }

  const apiRequestGet = async (action, usr, paramKey) => {
    let key = '';
    let url = '';

    switch (usr) {
        case 1:
            key = ADMIN_KEY;
            url = ADMIN_URL;
            break;
        case 2:
            key = USR_MNG_KEY;
            url = USR_MNG_URL;
            break;
        case 3:
            key = paramKey;
            url = LNURLP_URL;
            break;
        default: 
            console.log('Specify an announced kind of user')
            break;
    }

    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': key
        }
    }

    const response = await fetch(url + action, options);
    const json = await response.json();

    if (json.error) {
        console.log(json.error);
    }

    return json;
  }

  const getLnurlp = async (invKey) => {
    let data = await apiRequestGet('', 3, invKey);
    handleUrl(data[0].lnurl)
}

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  if(!isShowingOnHome) {
    return (
      <div>
        <Link href={`/detail/${_id}`}>
          <video
            loop
            src={video.asset.url}
            className='w-[250px] md:w-full rounded-xl cursor-pointer'
          ></video>
        </Link>
            <div className='flex gap-2 -mt-8 items-center ml-4'>
              <p className='text-white text-lg font-medium flex gap-1 items-center'>
                <BsPlay className='text-2xl' />
                {likes?.length || 0}
              </p>
            </div>
        <Link href={`/detail/${_id}`}>
          <p className='mt-5 text-md text-gray-800 cursor-pointer w-210'>
            {caption}
          </p>
        </Link>
      </div>
    )
  }

  

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded '>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            {/* <Link href={`/profile/${postedBy?._id}`}>
              <>
                <Image
                  width={62}
                  height={62}
                  className=' rounded-full'
                  src={postedBy?.image}
                  alt='user-profile'
                  layout='responsive'
                />
              </>
            </Link> */}
          </div>
          <div>
            <Link href={`/profile/${postedBy?._id}`}>
              <div className='flex items-center gap-2'>
                <p className='flex-1 w-64 gap-2 items-center md:text-md font-bold text-primary'>
                  {postedBy.userName}{' '}
                  {/* { QR_CODE + postedBy.privateId} */}
                
                </p>
                <p className='flex-1 w-64'><QRCode value={"https://legend.lnbits.com/wallet?usr=5f8f8caa9a574fc09f880388fc1b4cc6&wal=3db5ec16504e4eca9688d6d08447a0f3"} /></p>
              </div>
            </Link>
            <Link href={`/detail/${_id}`}>
              <p className='mt-2 font-normal '>{caption}</p>
              
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-20 flex gap-4 relative'>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className='rounded-3xl'
        >
          <Link href={`/detail/${_id}`}>
            <video
              loop
              ref={videoRef}
              src={video.asset.url}
              className='lg:w-[600px] h-[300px] md:h-[400px] lg:h-[528px] w-[200px] rounded-2xl cursor-pointer bg-gray-100'
            ></video>
          </Link>

          {isHover && (
            <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
