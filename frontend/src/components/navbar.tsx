import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DriveIcon from '@mui/icons-material/DriveEta'

export function NavBar() {
    return(
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit"  aria-label="menu">
                    <DriveIcon />
                </IconButton>
                <Typography variant="h6">Code Delivery</Typography>
            </Toolbar>
        </AppBar>
    )
}