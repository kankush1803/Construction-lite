-- Construction Monitor Database Seed Data

-- Clear existing data
TRUNCATE TABLE alerts, telemetry, workers, equipment, projects RESTART IDENTITY CASCADE;

-- Insert Projects
INSERT INTO projects (name, code, client, location, budget, spent, start_date, end_date, progress, status)
VALUES
    ('Skyline Heights Tower A', 'PRJ-2026-001', 'Metro Urban Corp', 'Downtown Sector 4', 45000000.00, 28500000.00, '2026-01-15', '2026-12-30', 68.50, 'In Progress'),
    ('Riverfront Commercial Plaza', 'PRJ-2026-002', 'Riverfront Dev Ltd', 'East River Boulevard', 72000000.00, 31000000.00, '2026-03-01', '2027-04-15', 43.00, 'In Progress'),
    ('Greenwood Logistics Hub', 'PRJ-2026-003', 'Apex Cargo Systems', 'Industrial Zone West', 18500000.00, 16800000.00, '2025-10-01', '2026-11-20', 91.20, 'Near Completion'),
    ('Oakwood Medical Center', 'PRJ-2026-004', 'HealthFirst Properties', 'North Health District', 38000000.00, 5200000.00, '2026-08-01', '2027-09-30', 14.00, 'Planning');

-- Insert Equipment
INSERT INTO equipment (project_id, name, type, serial_number, status, health_score, fuel_level, hours_operated, location, last_maintenance)
VALUES
    (1, 'CAT 336 Hydraulic Excavator', 'Excavator', 'EQ-CAT-336-01', 'Active', 94.50, 78.00, 1420.50, 'Sector 4 Excavation Zone', '2026-09-15'),
    (1, 'Liebherr 280 EC-H Tower Crane', 'Tower Crane', 'EQ-LIE-280-01', 'Active', 98.00, 92.00, 2150.00, 'Tower A Center Core', '2026-10-02'),
    (1, 'Komatsu D65PX Bulldozer', 'Bulldozer', 'EQ-KOM-065-02', 'Idle', 82.00, 45.00, 890.00, 'South Access Ramp', '2026-08-20'),
    (2, 'Putzmeister BSF 36 Concrete Pump', 'Concrete Mixer', 'EQ-PUT-036-01', 'Active', 91.00, 65.00, 640.25, 'Plaza Foundation Deck', '2026-09-28'),
    (2, 'Volvo FMX Dump Truck 01', 'Dump Truck', 'EQ-VOL-FMX-01', 'Active', 88.50, 55.00, 1780.00, 'Transit Route B', '2026-09-10'),
    (3, 'Caterpillar 950M Wheel Loader', 'Loader', 'EQ-CAT-950-01', 'Maintenance', 64.00, 30.00, 3420.00, 'Main Depot Workshop', '2026-10-18');

-- Insert Workers
INSERT INTO workers (project_id, full_name, role, trade, shift, status, safety_certified, check_in_time)
VALUES
    (1, 'Marcus Vance', 'Site Foreman', 'Civil', 'Day', 'On Site', TRUE, '2026-10-20 07:00:00+00'),
    (1, 'Elena Rostova', 'Heavy Crane Operator', 'Mechanical', 'Day', 'On Site', TRUE, '2026-10-20 07:15:00+00'),
    (1, 'David Chen', 'Lead Structural Welder', 'Mechanical', 'Day', 'On Site', TRUE, '2026-10-20 07:30:00+00'),
    (1, 'Amina Diallo', 'Safety Inspector', 'Safety', 'Day', 'On Site', TRUE, '2026-10-20 08:00:00+00'),
    (2, 'Carlos Mendez', 'Concrete Operations Lead', 'Civil', 'Day', 'On Site', TRUE, '2026-10-20 06:45:00+00'),
    (2, 'Rachel Adams', 'Electrical Systems Lead', 'Electrical', 'Day', 'On Break', TRUE, '2026-10-20 07:05:00+00'),
    (3, 'Jamal Wright', 'Heavy Equipment Tech', 'Mechanical', 'Morning', 'Off Site', TRUE, '2026-10-20 06:00:00+00');

-- Insert Telemetry Records
INSERT INTO telemetry (equipment_id, sensor_type, value, unit, status, timestamp, metadata)
VALUES
    (1, 'temperature', 84.50, '°C', 'Normal', CURRENT_TIMESTAMP - INTERVAL '15 minutes', '{"sensor_id": "SN-TEMP-101", "ambient": 24}'),
    (1, 'vibration', 2.30, 'mm/s', 'Normal', CURRENT_TIMESTAMP - INTERVAL '10 minutes', '{"sensor_id": "SN-VIB-102", "axis": "xyz"}'),
    (1, 'fuel', 78.00, '%', 'Normal', CURRENT_TIMESTAMP - INTERVAL '5 minutes', '{"sensor_id": "SN-FUEL-103"}'),
    (2, 'temperature', 72.00, '°C', 'Normal', CURRENT_TIMESTAMP - INTERVAL '10 minutes', '{"sensor_id": "SN-TEMP-201"}'),
    (2, 'wind_speed', 18.50, 'km/h', 'Normal', CURRENT_TIMESTAMP - INTERVAL '5 minutes', '{"sensor_id": "SN-WIND-202"}'),
    (3, 'temperature', 104.20, '°C', 'Warning', CURRENT_TIMESTAMP - INTERVAL '20 minutes', '{"sensor_id": "SN-TEMP-301", "warning": "Coolant threshold near max"}'),
    (6, 'vibration', 7.80, 'mm/s', 'Critical', CURRENT_TIMESTAMP - INTERVAL '35 minutes', '{"sensor_id": "SN-VIB-601", "bearing": "rear-axle"}');

-- Insert Alerts
INSERT INTO alerts (project_id, equipment_id, type, severity, message, status, acknowledged_at)
VALUES
    (3, 6, 'Equipment', 'Critical', 'Excessive vibration detected on Caterpillar 950M rear axle bearing (7.8 mm/s). Maintenance inspection required.', 'Open', NULL),
    (1, 3, 'Equipment', 'Warning', 'Engine coolant temperature elevated on Komatsu D65PX (104.2 °C).', 'Acknowledged', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (1, NULL, 'Safety', 'Warning', 'Wind gusts reaching 35 km/h at Crane 01 elevation. High-altitude operations advisory.', 'Open', NULL),
    (2, NULL, 'Schedule', 'Info', 'Foundation concrete pour completed ahead of schedule by 2 hours.', 'Open', NULL);
