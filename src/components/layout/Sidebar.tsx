import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Fuel, 
  Truck, 
  Users, 
  UserCircle, 
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Fuel, label: 'Fuel Entry', path: '/fuel-entry' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    ...(profile?.role === 'admin' ? [
      { icon: Truck, label: 'Trucks', path: '/trucks' },
      { icon: Users, label: 'Drivers', path: '/drivers' },
      { icon: UserCircle, label: 'Customers', path: '/customers' },
      { icon: DollarSign, label: 'Budgeted Rates', path: '/rates' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ] : []),
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar transition-transform duration-300",
        "border-r border-sidebar-border",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Fuel className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold text-sidebar-foreground">FuelTrack</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 text-sm">
              <p className="font-medium text-sidebar-foreground">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};