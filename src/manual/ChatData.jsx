import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { postApiData } from '../Services/api'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import base_url from '../baseUrl'

function ChatData() {
    const [searchParams] = useSearchParams()
    const [chat, setChat] = useState([])
    const [sender, setSender] = useState()
    const [receiver, setReceiver] = useState()
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const fetchChatData = async () => {
        if (!from || !to) {
            return
        }
        const data = { from, to }
        try {
            const result = await postApiData(
                `get-chat-data`, data
            );
            if (result.status) {
                setChat(result.allMsg);
                setSender(result.users.sender);
                setReceiver(result.users?.receiver)
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };
    useEffect(() => {
        fetchChatData()
    }, [])
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            requestAnimationFrame(() => {
                el.scrollTop = el.scrollHeight;
            });
        }
    }, [chat]);


    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            <div ref={containerRef} className='main-content' style={{ height: '750px', minHeight: '750px', overflowY: 'auto' }}>
                <div className="cht-type-bx ">
                    <div
                    // style={{ maxHeight: '450px', minHeight: '660px', overflowY: 'auto' }}
                    >
                        {chat?.length > 0 &&
                            chat
                                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ensure messages are sorted by date
                                .map((item, key, arr) => {
                                    const messageDate = new Date(item.createdAt);
                                    const formattedDate = messageDate.toLocaleString("en-US", {
                                        weekday: "long",
                                        hour: "numeric",
                                        minute: "numeric",
                                    });
                                    const dayString = messageDate.toDateString();
                                    const showDate =
                                        key === 0 || dayString !== new Date(arr[key - 1].createdAt).toDateString();
                                    return (
                                        <React.Fragment key={key}>
                                            {showDate && (
                                                <div className="chat-date-separator text-center my-2">
                                                    {dayString}
                                                </div>
                                            )}
                                            {item?.to === receiver?.user?._id ? (
                                                <div className="d-flex justify-content-between chat-typ-message-box mt-2">
                                                    <div className="d-flex gap-3">
                                                        <div className={`d-flex flex-column usr-cht-pic position-relative `}>
                                                            <img src={receiver?.profile?.profileImage && `${base_url}/${receiver?.profile.profileImage}`}
                                                                className="cht-usr-pic" alt="profile" />
                                                        </div>
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-center gap-5">
                                                                <h6 className="mb-0 text-capitalize">
                                                                    {receiver?.user?.firstName} {receiver?.user?.lastName}
                                                                </h6>
                                                                <p className="mb-0">
                                                                    <span>{formattedDate}</span>
                                                                </p>
                                                            </div>
                                                            <div className="cht-typ-pra my-2">
                                                                {item?.chatImg ?
                                                                    <>
                                                                        <img src={`${base_url}/${item?.chatImg}`} width={200} height={150} />
                                                                        <p>{item?.text}</p>
                                                                    </>
                                                                    : <p >{item?.text}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cht-cont-bx"></div>
                                                </div>
                                            ) : (
                                                <div className="d-flex justify-content-end w-100 mt-3">
                                                    <div className="d-flex gap-3">
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-center gap-5">
                                                                <div className={`d-flex flex-column usr-cht-pic position-relative `}>
                                                                    <img src={sender?.profile?.profileImage &&
                                                                        `${base_url}/${sender?.profile.profileImage}`}
                                                                        className="cht-usr-pic" alt="profile" />
                                                                </div>
                                                                <h6 className="mb-0">{sender?.user?.firstName}</h6>
                                                                <p className="mb-0 mt-1">
                                                                    <span>{formattedDate}</span>
                                                                </p>
                                                            </div>
                                                            <div className="cht-typ-pra my-2">
                                                                {item?.chatImg ?
                                                                    <>
                                                                        <img src={`${base_url}/${item?.chatImg}`} width={200} height={150} />
                                                                        <p>{item?.text}</p>
                                                                    </>
                                                                    : <p className="cht-usr-you">{item?.text}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cht-cont-bx"></div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default ChatData
