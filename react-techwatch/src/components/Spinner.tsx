import React from 'react'
import { CirclesWithBar } from 'react-loader-spinner';
type Props = {
  // crl: string;
  // loading: boolean;
}

const Spinner = (props: Props) => {
  return (
    <div className='flex max-h-screen w-full' id='spinner'>
      <div style={{  margin: 'auto' }} className='h-full'>
        <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{display: "block", margin: "0 auto", marginTop: "150px"}}
            wrapperClass=""
            visible={true}
            outerCircleColor=""
            innerCircleColor=""
            barColor=""
            ariaLabel='circles-with-bar-loading'
        />
      </div>
    </div>
  )
}

export default Spinner