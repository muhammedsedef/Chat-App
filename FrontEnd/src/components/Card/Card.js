import React, {useContext} from 'react'
import styles from './card.module.css'
import Photo from '../../images/pp.svg'
import { AuthContext } from '../../context/AuthContext'

const Card = ( {name = "Berk Ozpinar", status = "Online", photo = Photo, current = false, conversation} ) => {
    const [user, setUser] = useContext(AuthContext)
    const indicator = {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: status === "Online" ? "#19B532" : "#B51919",
    }

    const cardStyles = {
        backgroundColor: current ? '#348C74' :'#CEE4DE',
        color: current ? 'white' : 'black',
        borderColor: current ? '#CEE4DE' : '#348C74',
        cursor: 'pointer',
    }
    let friend = conversation?.members.find(m => m._id !== user)


    if (conversation) {
        return (
            <div className={styles.cardContainer}>
                <div style = {cardStyles} className={styles.card}>
                    <div className={styles.photo}>
                        <img src={photo} alt="" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.top}>
                            <div style={indicator} ></div>
                            <span>{friend.firstName} {friend.lastName}</span>
                        </div>
                        <span>{status}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.cardContainer}>
            <div style = {cardStyles} className={styles.card}>
                <div className={styles.photo}>
                    <img src={photo} alt="" />
                </div>
                <div className={styles.info}>
                    <div className={styles.top}>
                        <div style={indicator} ></div>
                        <span>{name}</span>
                    </div>
                    <span>{status}</span>
                </div>
            </div>
        </div>
    )
}

export default Card