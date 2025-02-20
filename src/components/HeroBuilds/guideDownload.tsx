/* eslint-disable no-useless-escape */
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const GuideGuide = () => {
    const tamperMonkeyLink = 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo'
    // const [codeText, setCodeText] = useState('')
    // const updateCodeText = async () => {
    //     const t = (await fetch('tamperCode.txt')).text()
    //     const text = await t
    //     setCodeText(text)
    //     console.log(text)
    // }
    // updateCodeText()
    return (
        <div className="" style={{ padding: '10px', zIndex: 999, color: 'white', textTransform: 'capitalize' }}>
            <h4>Step 1:</h4>
            <a target='_blank' rel='noreferrer' href={tamperMonkeyLink}>
                <p>Download Tampermonkey extension</p>
            </a>
            <h4>Step 2</h4>
            <a href="https://greasyfork.org/en/scripts/372234-steam-guide-subscribe-all" rel='noreferrer'
                target='_blank'><p>download this tampermonkey script</p>
                <FontAwesomeIcon style={{ marginLeft: '10px' }} className='copy-match-id' icon={faCopy} color='white' />
            </a>
            {/* <h4>Step 3:</h4> */}
            {/* <p>Open tampermonkey extension
                <br></br>Create new script
                <br></br>Select all the text and replace it with your copied code.
                <br></br>Save the script
            </p> */}
            <h4>Step 3:</h4>
            <a target='_blank' rel='noreferrer' href='https://steamcommunity.com/id/27bslash/myworkshopfiles/?section=guides'>
                <p>Go to Steam Guide Page</p>
            </a>
        </div >
    )
}
export default GuideGuide