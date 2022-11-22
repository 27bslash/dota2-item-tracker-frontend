
import Button from '@mui/material/Button';

const HomeButton = (props: { text: string }) => {
    return (
        <div>
            <button className='nav-button' id={props.text} >{props.text}</button>
        </div>
    )
}
export default HomeButton