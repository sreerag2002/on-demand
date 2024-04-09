import React from 'react'

function FDresponseCard(props) {

    const {responseData} = props;
    console.log(responseData);

    return (
        <div>
            {
                    responseData.map((res) => (
                      <div className='d-flex justify-content-end mb-2'>
                        <span className='bg-light border rounded px-2' style={{ height: "auto", width: "320px" }}>
                          <p style={{ fontFamily: "Dosis" }}>Response from <b>{res.user}</b></p>
                          <p className='text-black' style={{ fontFamily: "Dosis", textAlign: "justify" }}>{res.respond}</p>
                        </span>
                      </div>
                    ))
                  }
        </div>
    )
}

export default FDresponseCard