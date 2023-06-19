import React from 'react';


export default function Weather({date, description}) {
    return (
        <>
            <p className='text-shadow'>Date: {date}</p>
            <p className='text-shadow'>Description: {description}</p>
        </>
    )
}
