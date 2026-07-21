touch README.md
git init
git checkout -b main
git add README.md
git commit -m "first commit"
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
git config --global user.email "daypirate2@networkbuster.net
"touch README.md
git init
git checkout -b main
git add README.md
git commit -m "first commit"
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
console.cloud.google.com/iam-admin/troubleshooter/summary;permissions=resourcemanager.projects.createBillingAssignment;token=AZRajuUs7--FfPhq75gHzxX6-fNdtJXI9F0OFXaP-I9OV9bIu902jqm-rsb5PJXPsKhrLpeN-1TQd97lgjnWtWyWkcHHBWfnfr2-NZKmr4M_3xMFZxxqjPq5bjlJ4HVYDV38hz0Ces2CAVAzsM5Hg2ZeuPu2A2XLpDplx5_AQw8xBMpEGXU2yZYM4AJn_xuyU1BU87LYAIQW?utm_campaign=role_request&utm_source=cloud_console
service-641343934416@gcp-sa-csc-hpsa.iam.gserviceaccount.com
"\
> touch README.md
git init
git checkout -b main
git add README.md
git commit -m "first commit"
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
Reinitialized existing Git repository in /home/daypirate2/.git/
Switched to a new branch 'main'
git pust -u origin main
"> touch README.md
git init
git checkout -b main
git add README.md
git commit -m "first commit"
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
Reinitialized existing Git repository in /home/daypirate2/.git/
Switched to a new branch 'main'
git push -u origin main
omit --global
git omit --global
commit --global
git commit --global
git commit -m "integrity"
Run
omit -- global
git commit -m "walle"
gcloud update
gcloud builds connections update github
gcloud app update
$ gcloud config set project VALUE
e62d0871f764c5d2832a96a6bd780fcb7d8131aa
git commit -a
git commit -m "gcloud"
git add .
git add a.
git add a .
git add -a
git add -f
git add https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
ps aux | grep git
kill -9 <git>
rm -f .git/index.lock
git status
git commit -m "integrity"
git commit -m "integrity" -n
#!/bin/sh
#
# Copyright 2013 Google Inc. All Rights Reserved.
#
# <cloud-sdk-sh-preamble>
#
#  CLOUDSDK_ROOT_DIR            (a)  installation root dir
#  CLOUDSDK_PYTHON              (u)  python interpreter path
#  CLOUDSDK_GSUTIL_PYTHON       (u)  python interpreter path for gsutil
#  CLOUDSDK_PYTHON_ARGS         (u)  python interpreter arguments
#  CLOUDSDK_PYTHON_SITEPACKAGES (u)  use python site packages
#  CLOUDSDK_BQ_PYTHON           (u)  python interpreter for bq
#  CLOUDSDK_ENCODING            (u)  python io encoding for gcloud
#
# (a) always defined by the preamble
# (u) user definition overrides preamble
# Wrapper around 'which' and 'command -v', tries which first, then falls back
# to command -v
_cloudsdk_which() {   which "$1" 2>/dev/null || command -v "$1" 2>/dev/null; }
order_python_no_check() {   selected_version="";   for python_version in "$@";   do     if [ -z "$selected_version" ]; then       if _cloudsdk_which $python_version > /dev/null; then         selected_version=$python_version;       fi;     fi;   done;   if [ -z "$selected_version" ]; then     selected_version=python;   fi;   echo $selected_version; }
order_python() {   selected_version="";   for python_version in "$@";   do     if [ -z "$selected_version" ]; then       if "$python_version" -c "import sys; sys.exit(0 if ((3,9) <= (sys.version_info.major, sys.version_info.minor) <= (3,14)) else 1)" > /dev/null 2>&1; then         selected_version=$python_version;       fi;     fi;   done;   echo $selected_version; }
# Determines the real cloud sdk root dir given the script path.
# Would be easier with a portable "readlink -f".
_cloudsdk_root_dir() {   case $1 in   /*)   _cloudsdk_path=$1;         ;;   */*)  _cloudsdk_path=$PWD/$1;         ;;   *)    _cloudsdk_path=$(_cloudsdk_which $1);         case $_cloudsdk_path in         /*) ;;         *)  _cloudsdk_path=$PWD/$_cloudsdk_path ;;         esac;         ;;   esac;   _cloudsdk_dir=0;   while :;   do     while _cloudsdk_link=$(readlink "$_cloudsdk_path");     do       case $_cloudsdk_link in       /*) _cloudsdk_path=$_cloudsdk_link ;;       *)  _cloudsdk_path=$(dirname "$_cloudsdk_path")/$_cloudsdk_link ;;       esac;     done;     case $_cloudsdk_dir in     1)  break ;;     esac;     if [ -d "${_cloudsdk_path}" ]; then       break;     fi;     _cloudsdk_dir=1;     _cloudsdk_path=$(dirname "$_cloudsdk_path");   done;   while :;   do  case $_cloudsdk_path in       */)     _cloudsdk_path=$(dirname "$_cloudsdk_path/.");               ;;       */.)    _cloudsdk_path=$(dirname "$_cloudsdk_path");               ;;       */bin)  dirname "$_cloudsdk_path";               break;               ;;       *)      echo "$_cloudsdk_path";               break;               ;;       esac;   done; }
CLOUDSDK_ROOT_DIR=$(_cloudsdk_root_dir "$0")
setup_cloudsdk_python() {
  if [ -z "$CLOUDSDK_PYTHON" ]; then
    ARCH=$(uname -m 2>/dev/null);     if [ -x "$CLOUDSDK_ROOT_DIR/platform/bundledpythonunix/bin/python3" ] &&         [ "$ARCH" = "x86_64" ] &&         "$CLOUDSDK_ROOT_DIR/platform/bundledpythonunix/bin/python3" --version > /dev/null 2>&1;     then       CLOUDSDK_PYTHON="$CLOUDSDK_ROOT_DIR/platform/bundledpythonunix/bin/python3";       CLOUDSDK_PYTHON_SITEPACKAGES=1;     else       GLOBAL_CONFIG="$HOME/.config/gcloud";       if [ "$CLOUDSDK_CONFIG" ];       then         GLOBAL_CONFIG="$CLOUDSDK_CONFIG";       fi
      if [ -f "$GLOBAL_CONFIG/virtenv/bin/activate" ];       then         if [ -f "$GLOBAL_CONFIG/virtenv/enabled" ];         then
          . "$GLOBAL_CONFIG/virtenv/bin/activate";         fi;       fi;       primary_python=python3.14;       CLOUDSDK_PYTHON=$(order_python "$primary_python" python3.13 python3.12 python3 python3.11 python3.10 python);       if [ -z "$CLOUDSDK_PYTHON" ]; then         CLOUDSDK_PYTHON=$(order_python_no_check python3 python);       fi;     fi;   fi; }
setup_cloudsdk_python
# $PYTHONHOME can interfere with gcloud. Users should use
# CLOUDSDK_PYTHON to configure which python gcloud uses.
unset PYTHONHOME
# if CLOUDSDK_PYTHON_SITEPACKAGES and VIRTUAL_ENV are empty
case :$CLOUDSDK_PYTHON_SITEPACKAGES:$VIRTUAL_ENV: in :::)  # add -S to CLOUDSDK_PYTHON_ARGS if not already there
      case " $CLOUDSDK_PYTHON_ARGS " in       *" -S "*) ;;       "  ")     CLOUDSDK_PYTHON_ARGS="-S";                 ;;       *)        CLOUDSDK_PYTHON_ARGS="$CLOUDSDK_PYTHON_ARGS -S";                 ;;       esac;       unset CLOUDSDK_PYTHON_SITEPACKAGES;       ;; *)    # remove -S from CLOUDSDK_PYTHON_ARGS if already there
      while :; do         case " $CLOUDSDK_PYTHON_ARGS " in         *" -S "*) CLOUDSDK_PYTHON_ARGS=${CLOUDSDK_PYTHON_ARGS%%-S*}' '${CLOUDSDK_PYTHON_ARGS#*-S} ;;         *) break ;;         esac;       done
      [ -z "$CLOUDSDK_PYTHON_SITEPACKAGES" ] &&         CLOUDSDK_PYTHON_SITEPACKAGES=1;       export CLOUDSDK_PYTHON_SITEPACKAGES;       ;; esac
# Allow users to set the Python interpreter used to launch gsutil, falling
# back to the CLOUDSDK_PYTHON interpreter otherwise.
if [ -z "$CLOUDSDK_GSUTIL_PYTHON" ]; then   CLOUDSDK_GSUTIL_PYTHON="$CLOUDSDK_PYTHON"; fi
if [ -z "$CLOUDSDK_BQ_PYTHON" ]; then   CLOUDSDK_BQ_PYTHON="$CLOUDSDK_PYTHON"; fi
if [ -z "$CLOUDSDK_ENCODING" ]; then   if [ -z "$PYTHONIOENCODING" ]; then     CLOUDSDK_ENCODING=UTF-8;   else     CLOUDSDK_ENCODING="$PYTHONIOENCODING";   fi; fi
export CLOUDSDK_ROOT_DIR
export CLOUDSDK_PYTHON_ARGS
export CLOUDSDK_GSUTIL_PYTHON
export CLOUDSDK_BQ_PYTHON
export CLOUDSDK_ENCODING
export PYTHONIOENCODING="$CLOUDSDK_ENCODING"
# </cloud-sdk-sh-preamble>
if [ -n "${CLOUDSDK_USE_GOCLOUD:-}" ]; then   exec "${CLOUDSDK_ROOT_DIR}/bin/gocloud" "$@"; fi
exec "$CLOUDSDK_PYTHON" $CLOUDSDK_PYTHON_ARGS "${CLOUDSDK_ROOT_DIR}/lib/gcloud.py" "$@"
git add u .
ps aux | grep git
kill -9 <git
kill -9 <git>
kill -9 <process_id>
kill -9 <git>
ps aux | grep git
kill -9 <git>
rm -f .git/index.lock
git status
git add .
git commit -m "integrity"
git push origin main
git remote add origin https://main-instance-159147526315-git.us-central1.sourcemanager.dev/source-root-7076/source-root.git
git push -u origin main
src
git add .
git commit -m "integrity"
git push -m
git push -a
git push -A "ok"
git stash save "houston"
git stash apply
git add houston
git add <houston>
git commit -m "add fingerprint update"
git add .
git commit -m "add fingerprint update"
git remote add origin git@main-instance-159147526315-ssh.us-central1.sourcemanager.dev:source-root-7076/source-root.git
git remote add bigtree git@main-instance-159147526315-ssh.us-central1.sourcemanager.dev:source-root-7076/source-root.git
git init
git commit -m "integrity"
update gcloud
gcloud auth login --no-launch-browser
gcloud config set project Source.root
gcloud config set projectgit@main-instance-159147526315-ssh.us-central1.sourcemanager.dev:source-root-7076/source-root.git
gcloud config set project git@main-instance-159147526315-ssh.us-central1.sourcemanager.dev:source-root-7076/source-root.git
gcloud config set project PROJECT_ID
gcloud config set project source-503021
