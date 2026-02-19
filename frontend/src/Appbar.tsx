import {AppBar, FormControlLabel, Switch, Tab, Tabs, Toolbar, Typography} from "@mui/material";

import { useThemeContext} from "./theme/ThemeContext.tsx";
import {DarkMode, LightMode} from "@mui/icons-material";


interface Props {
    category: string,
    setCategory: (category: string) => void;
}


function Appbar({category, setCategory}: Props){

    const { mode, toggleColorMode } = useThemeContext();

    return(

        <AppBar position="static" sx={{backgroundColor: "primary.main"}}>
          <Toolbar>
            <Typography variant="h6" sx={{ mr: 4 }}>
              Gartenwarte
            </Typography>

            <Tabs
              value={category}
              onChange={(_, newValue) => setCategory(newValue)}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ justifyContent: "flex-start" }}
            >
              <Tab label={"Maschinen & Geräte"} value={"machines"}/>
              <Tab label={"Bekleidung"} value={"clothing"}/>
              <Tab label={"Merchandise & Präsente"} value={"gifts"}/>
              <Tab label={"Büroartikel & Ausstattung"} value={"equipment"}/>
              <Tab label={"Kleinwerkzeug"} value={"tools"}/>
              <Tab label={"Sprit & Schmierstoffe"} value={"fuel"}/>
            </Tabs>

            <div className={"flex grow"}/>
            <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleColorMode}
                    color="default"
                  />
                }
                label={mode === "dark" ? <DarkMode/> : <LightMode/>}
              />
          </Toolbar>
        </AppBar>

    )

}

export default Appbar