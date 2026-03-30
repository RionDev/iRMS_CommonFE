import { NavLink } from "react-router-dom";
import { theme } from "../styles/theme";

export interface SideNavItem {
  label: string;
  to: string;
}

interface SideNavProps {
  items: SideNavItem[];
}

export function SideNav({ items }: SideNavProps) {
  return (
    <aside
      style={{
        width: theme.layout.sideNavWidth,
        flexShrink: 0,
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.card,
        padding: "12px",
        alignSelf: "flex-start",
      }}
    >
      <nav aria-label="앱 메뉴" style={{ display: "grid", gap: "8px" }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "block",
              padding: "10px 12px",
              borderRadius: theme.radius.md,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: isActive ? theme.colors.primaryText : theme.colors.text,
              backgroundColor: isActive ? theme.colors.primary : "transparent",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
