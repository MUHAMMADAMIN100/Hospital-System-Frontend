import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  LocalHospital,
  People,
  Assessment,
  Menu as MenuIcon,
} from "@mui/icons-material"

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: "Больницы", path: "/hospitals", icon: <LocalHospital /> },
    { label: "Пациенты", path: "/patients", icon: <People /> },
    { label: "Отчёты", path: "/reports", icon: <Assessment /> },
  ]

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Логотип */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalHospital sx={{ fontSize: 32, color: "#4fc3f7" }} />
              <Box>
                <Box
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.4rem" },
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Медицинская Система
                </Box>
                <Box
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    color: "#90caf9",
                  }}
                >
                  Управление больницами и пациентами
                </Box>
              </Box>
            </Box>

            {/* Desktop navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
              }}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? "#4fc3f7" : "#fff",
                      fontWeight: isActive ? 600 : 400,
                      px: 3,
                      borderRadius: 2,
                      background: isActive
                        ? "rgba(79,195,247,0.15)"
                        : "transparent",
                      "&:hover": {
                        background: "rgba(79,195,247,0.2)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>

            {/* Mobile burger */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  selected={isActive}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      </Drawer>
    </>
  )
}