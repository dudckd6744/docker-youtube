import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscriber(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [subscribed, setsubscribed] = useState(false)

    useEffect(() => {
        var variable = { userTo: props.userTo}

        Axios.post('/api/subscribe/subscriberNumber', variable)
        .then(response =>{
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }else{
                alert("구독자 수 정보를 받아오지 못했습니다.")
            }
        })
        var subscribedvariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        Axios.post("/api/subscribe/subscribed", subscribedvariable)
        .then(response =>{
            if(response.data.success){
                setsubscribed(response.data.subscribed)
            }else{
                alert("정보를 받아오지못했습니다.")
            }
        })
    }, [])

    const onSubscribe =(e)=>{
        e.preventDefault()
            //d이미 구독중
            var variable = {
                userTo:props.userTo,
                userFrom:localStorage.getItem("userId")
            }
        if(subscribed){
            Axios.post("/api/subscribe/unSubscribe", variable)
            .then(response=> {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber - 1)
                    setsubscribed(!subscribed)
                }else{
                    alert("구독 취소하는데 실패했습니다.")
                }
            })

            //구독이 아니라면
        }else{
            Axios.post("/api/subscribe/subscribe", variable)
            .then(response=> {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber + 1)
                    setsubscribed(!subscribed)
                }else{
                    alert("구독하는데 실패했습니다.")
                }
            })
        }
    }

    return (
        <div>
            <button
                style={{ backgroundColor:`${subscribed ? "#AAAAAA":"#CC0000"}`, borderRadius:"4px",
                        color:"white", padding:"10px 16px",
                        fontWeight:"500", fontSize:"1rem", textTransform:"uppercase"}}
                        onClick={onSubscribe}
            >
                {SubscribeNumber} {subscribed ? "Subscribed":"Subscribe"}
            </button>
        </div>
    )
}

export default Subscriber
