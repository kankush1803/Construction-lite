-- Migration 002: Add Project Fields and Safe Schema Update
-- Compatible with PostgreSQL 12+

DO $$
BEGIN
    -- Ensure code column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='code') THEN
        ALTER TABLE projects ADD COLUMN code VARCHAR(50);
    END IF;

    -- Ensure client column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='client') THEN
        ALTER TABLE projects ADD COLUMN client VARCHAR(255) DEFAULT 'Standard Client';
    END IF;

    -- Ensure location column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='location') THEN
        ALTER TABLE projects ADD COLUMN location VARCHAR(255) DEFAULT 'Site Location';
    END IF;

    -- Ensure budget column exists with appropriate numeric precision
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='budget') THEN
        ALTER TABLE projects ADD COLUMN budget NUMERIC(14, 2) DEFAULT 0.00;
    END IF;

    -- Ensure progress column exists with appropriate numeric precision
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='progress') THEN
        ALTER TABLE projects ADD COLUMN progress NUMERIC(5, 2) DEFAULT 0.00;
    END IF;

    -- Ensure status column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='status') THEN
        ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'Planned';
    END IF;

    -- Ensure unique constraint on code
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_code_unique') THEN
        ALTER TABLE projects ADD CONSTRAINT projects_code_unique UNIQUE (code);
    END IF;
END $$;
