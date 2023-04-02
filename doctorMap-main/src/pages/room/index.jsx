import React from "react";
import {useParams} from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
function RoomPage() {
    const {roomId} = useParams();

    const myMeeting = async (element)=>{
        const appID = 621232863;
        const serverSecret = "7a62f7448d39a22da3f141a50a421d84";
        const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), "Dr.")
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom(
            {
                container: element, 
                sharedLinks:[
                  {  name: "Copy Link",
                     url: `http://localhost:3000/room/${roomId}`
                  }

                ],
                scenario:{
                    mode:ZegoUIKitPrebuilt.OneONoneCall,
                },
                showScreenSharingButton:false,
            }
        );
    }



    return ( 

      <div>
        <div ref={myMeeting}/>
      </div>
     );
}

export default RoomPage;