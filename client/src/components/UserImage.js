import { Box } from "@mui/material"


const UserImage = (props) => {
    return (
        <Box width={props.size || '60px'} height={props.size || '60px'}>
            <img
                style={{ objectFit: 'cover', borderRadius: '50%' }}
                width={props.size || '60px'}
                height={props.size || '60px'}
                alt='user'
                src={props.image}
            />
        </Box>
    )
}

export default UserImage