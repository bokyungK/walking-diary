import React from 'react';

function Main() {
    const videoUrl= '/Videos/main-video.mp4';
    return (
        <main>
            <video autoPlay loop muted playsInline>
                <source src={videoUrl} type='video/mp4' />
            </video>
            <p className='main-introduction'>
                반려견과 함께<br />
                하루 하루를 기록하는<br />
                '산책일기'<br />
                지금 바로 사용해보세요!
            </p>
        </main>
    )
  }
  
  export default Main;