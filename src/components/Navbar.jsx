import { Link, useLocation } from "react-router-dom"
import { AppBar, Toolbar, Button, Container, Box } from "@mui/material"
import { LocalHospital, People, Assessment } from "@mui/icons-material"

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { label: "Больницы", path: "/hospitals", icon: <LocalHospital /> },
    { label: "Пациенты", path: "/patients", icon: <People /> },
    { label: "Отчёты", path: "/reports", icon: <Assessment /> },
  ]

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalHospital sx={{ fontSize: 32, color: "#4fc3f7" }} />
            <Box>
              <Box
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                Медицинская Система
              </Box>
              <Box sx={{ fontSize: "0.75rem", color: "#90caf9", opacity: 0.8 }}>
                Управление больницами и пациентами
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path} // здесь используется React Router
                  startIcon={item.icon}
                  sx={{
                    color: isActive ? "#4fc3f7" : "#fff",
                    fontWeight: isActive ? 600 : 400,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: isActive
                      ? "linear-gradient(135deg, rgba(79, 195, 247, 0.15) 0%, rgba(41, 182, 246, 0.15) 100%)"
                      : "transparent",
                    border: isActive ? "1px solid rgba(79, 195, 247, 0.3)" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(79, 195, 247, 0.2) 0%, rgba(41, 182, 246, 0.2) 100%)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
