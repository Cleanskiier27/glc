import subprocess

def _transform_assets(cfg) -> None:
    # Add minification, image optimization, etc.
    pass

def _deploy_to_target(cfg) -> None:
    # Replace with your actual deploy:
    subprocess.run(["rsync", "-avz", "src/", str(cfg.deploy_target)], check=True)
    # or: docker push, aws s3 sync, scp, etc.
